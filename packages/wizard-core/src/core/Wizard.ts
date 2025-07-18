import { createLogger, type Logger, LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';
import { Pipeline } from '@hyperse/pipeline';
import { Root, WizardName } from '../constants.js';
import { CommandHandlerNotFoundError } from '../errors/CommandHandlerNotFoundError.js';
import { EventEmitter } from '../events/EventEmitter.js';
import { collectCommandFlags } from '../helpers/helper-collect-command-flags.js';
import { getAllCommandMap } from '../helpers/helper-command-map.js';
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
import type { Command, CommandContext } from '../types/type-command.js';
import type {
  CommandBuilder as CommandBuilderType,
  CommandNameToContext,
  GetCommandNameToContext,
} from '../types/type-command-builder.js';
import type { Plugin } from '../types/type-plugin.js';
import type { MergeCommandMapping } from '../types/type-utils.js';
import type {
  ParseOptions,
  PipelineContext,
  RootType,
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
> extends EventEmitter<NameToContext> {
  private logger: Logger;
  private locale = 'en';
  private errorHandler: ((err: unknown) => void) | undefined;
  private cliPipeline: Pipeline<PipelineContext> = new Pipeline();
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
      description: formatCommandName(Root),
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
    const commandPipeline = resolveCommandPipeline(
      this.locale,
      newArgs[newArgs.length - 1],
      commandMap
    );

    // Ensure the found pipeline matches the actual execution pipeline
    validateCommandPipeline(this.locale, newArgs, commandPipeline);

    for (const command of commandPipeline) {
      this.cliPipeline.use(async (ctx, next) => {
        await this.executeResolveOrHandler(commandPipeline, command, ctx, next);
      });
    }
  }

  private async executeResolveOrHandler(
    commandPipeline: Command<string | RootType>[],
    command: Command<string | RootType>,
    ctx: PipelineContext,
    next: Parameters<Parameters<Pipeline<PipelineContext>['use']>[number]>[1]
  ) {
    const name = command.getName();
    const description = command.getDescription();
    const definedFlags = command.getFlags() || {};

    // check has subCommand
    const subCommands = command.getSubCommands() || [];
    if (subCommands.length > 0) {
      // check has subCommand
      const resolver = command.getResolver() || (() => {});
      let resolverResult: CommandContext;
      if (typeof resolver === 'function') {
        resolverResult = await resolver({
          ctx: ctx.ctx,
          logger: this.logger,
          locale: this.locale,
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
      ctx: ctx.ctx,
      flags: pickFlags(ctx.flags, definedFlags),
      name,
      description,
      logger: this.logger,
      locale: this.locale,
    });

    const eventName = searchEventName(command, commandPipeline);
    this.emit(eventName, ctx.ctx as NameToContext[keyof NameToContext]);
    await next();
  }

  /**
   * @description
   * Parse the options or argv.
   *
   * @docsCategory core
   * @docsPage Wizard
   * @param optionsOrArgv The options or argv to parse.
   * @returns The wizard instance.
   */
  public parse(optionsOrArgv: string[] | ParseOptions = resolveArgv()) {
    this.cliPipeline.use(async (ctx, next) => {
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
    });
  }

  public getCommandBuilder(): CommandBuilderType<string | RootType> {
    return this.commandBuilder;
  }

  /**
   * @description
   * Set the name of the wizard.
   *
   * @docsCategory core
   * @docsPage Wizard
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
   * @docsCategory core
   * @docsPage Wizard
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
   * @docsCategory core
   * @docsPage Wizard
   * @param version The version of the wizard.
   * @returns The wizard instance.
   */
  public get version() {
    return this.options.version;
  }
  /**
   * @description
   * Get the i18n instance.
   *
   * @docsCategory core
   * @docsPage Wizard
   * @returns The i18n instance.
   */
  public get i18n() {
    const t = useLocale(this.locale);
    return {
      t,
    };
  }
}
