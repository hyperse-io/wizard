import { createLogger, type Logger, LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';
import { Pipeline } from '@hyperse/pipeline';
import { Root, WizardName } from '../constants.js';
import { CommandHandlerNotFoundError } from '../errors/CommandHandlerNotFoundError.js';
import { EventEmitter } from '../events/EventEmitter.js';
import { collectCommandFlags } from '../helpers/helper-collect-command-flags.js';
import { getAllCommandMap } from '../helpers/helper-command-map.js';
import { localeMessageValue } from '../helpers/helper-locale-message-value.js';
import {
  parseFlags,
  type ParseFlagsResult,
} from '../helpers/helper-parse-flags.js';
import { pickFlags } from '../helpers/helper-pick-flags.js';
import { resolveArgv } from '../helpers/helper-resolve-argv.js';
import { resolveCommandPipeline } from '../helpers/helper-resolve-command-pipeline.js';
import { resolveLocale } from '../helpers/helper-resolve-locale.js';
import { resolveOptionsOrArgv } from '../helpers/helper-resolve-options-or-argv.js';
import { searchEventName } from '../helpers/helper-search-event-name.js';
import {
  formatCommandName,
  validateCommandPipeline,
} from '../helpers/helper-validate-command-pipeline.js';
import { useLocale } from '../i18n/index.js';
import { messages } from '../i18n/messages.js';
import type { Command, CommandContext } from '../types/type-command.js';
import type {
  CommandBuilder as CommandBuilderType,
  CommandNameToContext,
  GetCommandNameToContext,
} from '../types/type-command-builder.js';
import type {
  LocaleMessagesKeys,
  LocaleMessagesObjectWithoutDefault,
} from '../types/type-locale-messages.js';
import type { Plugin } from '../types/type-plugin.js';
import type { MergeCommandMapping } from '../types/type-utils.js';
import type {
  ParseOptions,
  PipelineContext,
  RootType,
  WizardEventContext,
  WizardOptions,
} from '../types/type-wizard.js';
import { createCommandBuilder } from './CommandBuilder.js';

/**
 * @example
 * .name("Foo CLI") // Optional, defaults to scriptName
 * .description("A simple cli")
 * .version("1.0.0")
 * .command("foo", "A foo command")
 * .on("foo", (context) => {
 * 	 console.log("It works!");
 * })
 * .parse();
 */
export class Wizard<
  NameToContext extends CommandNameToContext = {},
> extends EventEmitter<WizardEventContext<NameToContext>> {
  private logger: Logger;
  private locale: LocaleMessagesKeys = 'en';
  private localeMessages: LocaleMessagesObjectWithoutDefault = {};
  private errorHandler: ((err: unknown) => void) | undefined;
  private cliPipeline: Pipeline<PipelineContext>;
  private commandBuilder: CommandBuilderType<string | RootType>;

  constructor(private options: WizardOptions) {
    super();
    this.locale = resolveLocale();
    this.logger = createLogger({
      name: WizardName,
      thresholdLevel: options.thresholdLogLevel ?? LogLevel.Info,
    })
      .use(
        createStdoutPlugin({
          noColor: options.noColor ?? false,
        })
      )
      .build();
    this.errorHandler = options.errorHandler ?? (() => {});
    this.setupRootCommand();
  }

  private setupRootCommand() {
    if (this.commandBuilder) {
      return;
    }
    this.commandBuilder = createCommandBuilder<string | RootType>(Root, {
      description: (t) => t('core.cli.rootDescription'),
    });
  }

  register<CommandBuilder extends CommandBuilderType<any, any, any, any, any>>(
    builder: CommandBuilder
  ): Wizard<
    MergeCommandMapping<NameToContext, GetCommandNameToContext<CommandBuilder>>
  > {
    this.commandBuilder = this.commandBuilder.use(builder);
    return this as unknown as Wizard<
      MergeCommandMapping<
        NameToContext,
        GetCommandNameToContext<CommandBuilder>
      >
    >;
  }

  use<PluginCommandMapping extends CommandNameToContext>(
    plugin: Plugin<
      NameToContext,
      MergeCommandMapping<NameToContext, PluginCommandMapping>
    >
  ): Wizard<MergeCommandMapping<NameToContext, PluginCommandMapping>> {
    this.localeMessages = Object.assign(
      {},
      this.localeMessages,
      plugin.localeMessages ?? {}
    );
    return plugin.setup(this) as unknown as Wizard<
      MergeCommandMapping<NameToContext, PluginCommandMapping>
    >;
  }

  private setupCommandPipeline(parsedFlags: ParseFlagsResult) {
    const newArgs: string[] = parsedFlags.args;

    if (!newArgs || newArgs.length === 0) {
      throw new Error('No command given');
    }
    const commandMap = getAllCommandMap(this.commandBuilder);
    //get command pipeline, eg: build.evolve.mini
    const lastCommandName = newArgs[newArgs.length - 1];
    const commandPipeline = resolveCommandPipeline(
      this.locale,
      lastCommandName,
      commandMap
    );

    // Ensure the found pipeline matches the actual execution pipeline
    validateCommandPipeline(this.locale, newArgs, commandPipeline);

    for (const command of commandPipeline) {
      this.cliPipeline.use(async (ctx, next) => {
        await this.executeResolveOrHandler(
          lastCommandName,
          commandPipeline,
          command,
          ctx,
          next
        );
      });
    }
  }

  private async executeResolveOrHandler(
    lastCommandName: string,
    commandPipeline: Command<string | RootType>[],
    command: Command<string | RootType>,
    ctx: PipelineContext,
    next: Parameters<Parameters<Pipeline<PipelineContext>['use']>[number]>[1]
  ) {
    const name = command.getName();
    const extraOptions = command.getExtraOptions();
    const definedFlags = command.getFlags() || {};

    // check has subCommand
    const subCommands = command.getSubCommands() || [];
    if (lastCommandName !== name && subCommands.length > 0) {
      // check has subCommand
      const resolver = command.getResolver() || (() => {});
      let resolverResult: CommandContext;
      if (typeof resolver === 'function') {
        resolverResult = await resolver({
          ...extraOptions,
          ctx: ctx.ctx,
          name,
          logger: this.logger,
          locale: this.locale,
          i18n: this.i18n,
        });
      } else {
        resolverResult = resolver;
      }
      ctx.ctx = resolverResult;
      await next();
      return;
    }

    // check has handler
    const handler = command.getHandler();

    if (!handler) {
      throw new CommandHandlerNotFoundError(this.locale, {
        cmdName: formatCommandName(name),
      });
    }

    await handler({
      ...extraOptions,
      ctx: ctx.ctx,
      flags: pickFlags(ctx.flags, definedFlags),
      name,
      logger: this.logger,
      locale: this.locale,
      i18n: this.i18n,
    });

    const eventName = searchEventName(command, commandPipeline);
    this.emit(eventName, {
      ctx: ctx.ctx as NameToContext[keyof NameToContext],
      logger: this.logger,
      locale: this.locale,
      i18n: this.i18n,
    });
    await next();
  }

  private mountedCommandPipeline() {
    this.cliPipeline.use(async (ctx, next) => {
      const { optionsOrArgv } = ctx;
      const argvOptions = resolveOptionsOrArgv(optionsOrArgv);
      if (argvOptions.run) {
        //@TODO: run the command
      }
      const commandMap = getAllCommandMap(this.commandBuilder);
      const allCommandFlags = collectCommandFlags(commandMap);
      const parsedFlags = parseFlags(allCommandFlags, argvOptions);

      ctx.flags = parsedFlags.flags;
      ctx.args = parsedFlags.args;
      ctx.eofArgs = parsedFlags.eofArgs;
      ctx.unknownFlags = parsedFlags.unknownFlags;

      this.setupCommandPipeline(parsedFlags);
      await next();
    });
  }

  /**
   * @description
   * Parse the options or argv.
   *
   * @param optionsOrArgv The options or argv to parse.
   * @returns The wizard instance.
   */
  public parse(optionsOrArgv: string[] | ParseOptions = resolveArgv()) {
    this.resetPipeline();
    this.mountedCommandPipeline();

    //error handling
    this.cliPipeline.use(async (_, next, error) => {
      if (error) {
        this.errorHandler?.(error);
      }
      await next();
    });

    this.cliPipeline.execute({
      args: [],
      eofArgs: [],
      flags: {},
      unknownFlags: {},
      optionsOrArgv,
    });
  }

  private resetPipeline() {
    this.cliPipeline = new Pipeline();
  }

  public getCommandBuilder(): CommandBuilderType<string | RootType> {
    return this.commandBuilder;
  }

  /**
   * @description
   * Set the name of the wizard.
   *
   * @param name The name of the wizard.
   * @returns The wizard instance.
   */
  public get name() {
    return this.options.name;
  }

  /**
   * @description
   * Get the description of the wizard.
   *
   * @param description The description of the wizard.
   * @returns The wizard instance.
   */
  public get description() {
    return this.options.description;
  }

  /**
   * @description
   * Get the version of the wizard.
   *
   * @param version The version of the wizard.
   * @returns The wizard instance.
   */
  public get version(): string {
    return localeMessageValue(
      'version',
      this.locale,
      this.i18n.t,
      this.options.version
    );
  }
  /**
   * @description
   * Get the i18n instance.
   *
   * @returns The i18n instance.
   */
  public get i18n() {
    const mergedLocaleMessages = Object.assign(
      {},
      messages,
      this.localeMessages
    );
    const t = useLocale(this.locale, mergedLocaleMessages);
    return {
      t,
    };
  }

  /**
   * @description
   * Get the locale of the wizard.
   *
   * @returns The locale of the wizard.
   */
  public getLocale(): LocaleMessagesKeys {
    return this.locale;
  }
}
