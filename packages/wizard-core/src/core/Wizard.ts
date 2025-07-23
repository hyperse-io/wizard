import { simpleDeepClone } from '@hyperse/deep-merge';
import { createLogger, type Logger, LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';
import { Pipeline } from '@hyperse/pipeline';
import { Root, rootName, WizardName } from '../constants.js';
import { CommandHandlerNotFoundError } from '../errors/CommandHandlerNotFoundError.js';
import { CommandNotProviderError } from '../errors/CommandNotProviderError.js';
import { EventEmitter } from '../events/EventEmitter.js';
import { mergeMessages } from '../helpers/helper-merge-messages.js';
import {
  collectCommandFlags,
  formatCommandName,
  getAllCommandMap,
  localeMessageValue,
  parseFlags,
  pickFlags,
  resolveArgv,
  resolveLocale,
  resolveOptionsOrArgv,
  searchCommandChain,
  searchCommandNameChain,
  validateCommandPipeline,
} from '../helpers/index.js';
import { useLocale } from '../i18n/index.js';
import { messages } from '../i18n/messages.js';
import type {
  Command,
  CommandContext,
  CommandName,
} from '../types/type-command.js';
import type {
  CommandBuilder as CommandBuilderType,
  CommandNameToContext,
  GetCommandNameToContext,
  MergeCommandNameToContext,
} from '../types/type-command-builder.js';
import type {
  LocaleMessageResolverExtraOptions,
  LocaleMessagesKeys,
  LocaleMessagesObject,
} from '../types/type-locale-messages.js';
import type { Plugin } from '../types/type-plugin.js';
import type {
  ParseOptions,
  PipelineContext,
  WizardEventContext,
  WizardOptions,
} from '../types/type-wizard.js';
import { createCommandBuilder } from './CommandBuilder.js';

/**
 * @description
 * The Wizard class is the core class of the CLI.
 * It is responsible for parsing the command line arguments,
 * executing the command, and emitting events.
 *
 * @example
 * ```ts
 * const wizard = new Wizard({
 *   name: 'my-cli',
 *   description: 'A simple cli',
 *   version: '1.0.0',
 * });
 */
export class Wizard<
  NameToContext extends CommandNameToContext = {},
> extends EventEmitter<WizardEventContext<NameToContext>> {
  private logger: Logger;
  private locale: LocaleMessagesKeys = 'en';
  private localeMessages: LocaleMessagesObject;
  private errorHandler: ((err: unknown) => void) | undefined;
  private cliPipeline: Pipeline<PipelineContext>;
  private commandBuilder: CommandBuilderType<CommandName>;
  private commandChain: Command<CommandName>[] = [];

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
    this.localeMessages = mergeMessages(
      messages as LocaleMessagesObject,
      options.localeMessages ?? {}
    );
    this.setupRootCommand();
  }

  /**
   * @description
   * Sets up the root command.
   */
  private setupRootCommand() {
    if (this.commandBuilder) {
      return;
    }
    this.commandBuilder = createCommandBuilder<CommandName>(Root, {
      description: () => rootName,
    });
  }

  /**
   * @description
   * Resets the pipeline.
   */
  private resetPipeline() {
    this.cliPipeline = new Pipeline();
    this.commandChain = [];
  }

  /**
   * @description
   * Handles the error.
   */
  private handleError(e: unknown) {
    if (this.errorHandler) {
      this.errorHandler(e);
    } else {
      throw e;
    }
  }

  /**
   * @description
   * Sets up the command pipeline.
   *
   * @param parsedFlags The parsed flags.
   */
  private setupCommandPipeline(
    lastCommandName: string,
    commandPipeline: Command<CommandName>[]
  ) {
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

  /**
   * @description
   * Executes the resolver or handler for the command.
   *
   * @param lastCommandName The name of the last command.
   * @param commandPipeline The command pipeline.
   * @param command The command.
   * @param ctx The context.
   * @param next The next function.
   * @returns The result.
   */
  private async executeResolveOrHandler<Name extends CommandName>(
    lastCommandName: string,
    commandPipeline: Command<Name>[],
    command: Command<Name>,
    ctx: PipelineContext,
    next: Parameters<Parameters<Pipeline<PipelineContext>['use']>[number]>[1]
  ) {
    const name = command.name;
    const definedFlags = command.flags || {};
    const commandBasicInfo = this.getCommandBasicInfoWithI18n(command);

    // check has subCommand
    const subCommands = command.subCommands || [];

    if (lastCommandName !== name && subCommands.length > 0) {
      // check has subCommand
      const resolver = command.resolver || (() => {});
      let resolverResult: CommandContext;
      if (typeof resolver === 'function') {
        resolverResult = await resolver(commandBasicInfo);
      } else {
        resolverResult = resolver;
      }

      ctx.ctx = resolverResult;
      await next();
      return;
    }

    // check has handler
    const handler = command.handler;

    if (!handler) {
      throw new CommandHandlerNotFoundError(this.locale, {
        cmdName: formatCommandName(name),
      });
    }

    handler({
      ...commandBasicInfo,
      ctx: ctx.ctx,
      flags: pickFlags(ctx.flags, definedFlags),
    });

    const commandNameChain = searchCommandNameChain(commandPipeline);
    this.emit(
      commandNameChain.join('.'),
      commandBasicInfo as unknown as WizardEventContext<NameToContext>[keyof WizardEventContext<NameToContext>]
    );
    await next();
  }

  /**
   * @description
   * Get the basic information of the command with i18n.
   *
   * @param command The command.
   * @returns The basic information of the command.
   */
  private getCommandBasicInfoWithI18n<Name extends CommandName>(
    command: Command<Name>
  ) {
    const name = command.name;
    const i18nExtraOptions = this.getI18nExtraOptions();

    const description = localeMessageValue(
      this.i18n.t,
      command.description,
      i18nExtraOptions
    );
    const example = command.example
      ? localeMessageValue(this.i18n.t, command.example, i18nExtraOptions)
      : undefined;
    const help = command.help
      ? localeMessageValue(this.i18n.t, command.help, i18nExtraOptions)
      : undefined;

    return {
      name,
      description,
      example,
      help,
      logger: this.logger,
      locale: this.locale,
      i18n: this.i18n,
    };
  }

  private getI18nExtraOptions(): LocaleMessageResolverExtraOptions {
    const commandNameChain = searchCommandNameChain(this.commandChain);
    return {
      commands: commandNameChain,
    };
  }

  /**
   * @description
   * Mounts the CLI pipeline, including argument parsing and error handling.
   * 1. Parses command line arguments and flags, sets them on ctx, and calls setupCommandPipeline.
   * 2. Mounts error handling middleware to catch and handle errors during execution.
   */
  private preparePipelineContext(
    optionsOrArgv: string[] | ParseOptions = resolveArgv()
  ) {
    try {
      const argvOptions = resolveOptionsOrArgv(optionsOrArgv);

      const commandMap = getAllCommandMap(this.commandBuilder);
      const allCommandFlags = collectCommandFlags(Object.values(commandMap));
      const parsedFlags = parseFlags(
        allCommandFlags,
        simpleDeepClone(argvOptions)
      );
      const inputCommands = parsedFlags?.args || [];

      if (!inputCommands || inputCommands.length === 0) {
        throw new CommandNotProviderError(this.locale);
      }

      //get command pipeline, eg: build.evolve.mini
      const startCommandName = inputCommands[inputCommands.length - 1];
      const commandPipeline = searchCommandChain(
        this.locale,
        startCommandName,
        commandMap
      );
      const inputCommandFlags = collectCommandFlags(commandPipeline);

      // Ensure the found pipeline matches the actual execution pipeline
      validateCommandPipeline(
        this.locale,
        inputCommandFlags,
        inputCommands,
        parsedFlags,
        commandPipeline
      );
      this.commandChain = commandPipeline;

      return {
        startCommandName,
        parsedFlags,
      };
    } catch (error) {
      this.handleError(error);
      return;
    }
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
    const pipelineContext = this.preparePipelineContext(optionsOrArgv);
    this.preparePipelineContext(optionsOrArgv);
    if (!pipelineContext) {
      return;
    }
    const { startCommandName, parsedFlags } = pipelineContext;
    this.setupCommandPipeline(startCommandName, this.commandChain);
    this.cliPipeline.use(async (_, next, error) => {
      if (error) {
        this.handleError(error);
      }
      await next();
    });
    this.cliPipeline.execute({
      ...parsedFlags,
      optionsOrArgv,
    });
  }

  /**
   * @description
   * Registers a command.
   *
   * @param builder The command builder.
   * @returns The wizard instance.
   */
  public register<
    CommandBuilder extends CommandBuilderType<any, any, any, any, any>,
  >(
    builder: CommandBuilder
  ): Omit<
    Wizard<
      MergeCommandNameToContext<
        NameToContext,
        GetCommandNameToContext<CommandBuilder>
      >
    >,
    'register'
  > {
    this.commandBuilder = this.commandBuilder.use(builder);
    return this as unknown as Wizard<
      MergeCommandNameToContext<
        NameToContext,
        GetCommandNameToContext<CommandBuilder>
      >
    >;
  }

  /**
   * @description
   * Registers a plugin.
   *
   * @param plugin The plugin.
   * @returns The wizard instance.
   */
  public use<PluginCommandMapping extends CommandNameToContext>(
    plugin: Plugin<
      NameToContext,
      MergeCommandNameToContext<NameToContext, PluginCommandMapping>
    >
  ): Wizard<MergeCommandNameToContext<NameToContext, PluginCommandMapping>> {
    this.localeMessages = mergeMessages(
      this.localeMessages,
      plugin.localeMessages
    );
    return plugin.setup(this, {
      name: plugin.name
        ? localeMessageValue(this.i18n.t, plugin.name)
        : undefined,
    }) as unknown as Wizard<
      MergeCommandNameToContext<NameToContext, PluginCommandMapping>
    >;
  }

  /**
   * @description
   * Set the name of the wizard.
   *
   * @param name The name of the wizard.
   * @returns The wizard instance.
   */
  public get name() {
    const i18nExtraOptions = this.getI18nExtraOptions();
    return localeMessageValue(this.i18n.t, this.options.name, i18nExtraOptions);
  }

  /**
   * @description
   * Get the description of the wizard.
   *
   * @param description The description of the wizard.
   * @returns The wizard instance.
   */
  public get description() {
    const i18nExtraOptions = this.getI18nExtraOptions();
    return localeMessageValue(
      this.i18n.t,
      this.options.description,
      i18nExtraOptions
    );
  }

  /**
   * @description
   * Get the version of the wizard.
   *
   * @param version The version of the wizard.
   * @returns The wizard instance.
   */
  public get version(): string {
    const i18nExtraOptions = this.getI18nExtraOptions();
    return localeMessageValue(
      this.i18n.t,
      this.options.version,
      i18nExtraOptions
    );
  }

  /**
   * @description
   * Get the i18n instance.
   *
   * @returns The i18n instance.
   */
  public get i18n() {
    const t = useLocale(this.locale, this.localeMessages);
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
