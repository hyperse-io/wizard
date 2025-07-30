import { type DeepPartial, simpleDeepClone } from '@hyperse/deep-merge';
import type { LogLevel } from '@hyperse/logger';
import { createLogger, type Logger, type LoggerContext } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';
import { Pipeline } from '@hyperse/pipeline';
import {
  DefaultLogLevel,
  DefaultNoColor,
  Root,
  rootName,
  WizardName,
} from '../constants.js';
import { CommandHandlerNotFoundError } from '../errors/CommandHandlerNotFoundError.js';
import { InvalidCommandNameError } from '../errors/CommandInvalidNameError.js';
import { EventEmitter } from '../events/EventEmitter.js';
import { createBuiltinFlags } from '../helpers/helper-create-builtin-flags.js';
import { createBuiltinInterceptor } from '../helpers/helper-create-builtin-interceptor.js';
import { globalFlagsWithI18n } from '../helpers/helper-global-flags-i18n.js';
import { mergeLocaleMessages } from '../helpers/helper-locale-message-merge.js';
import { resolveCommand } from '../helpers/helper-resolve-command.js';
import {
  commandChainWithI18n,
  commandMapWithI18n,
  commandTreeToMap,
  formatCommandName,
  localeMessageValue,
  parseFlags,
  pickFlags,
  resolveArgv,
  resolveLocale,
  resolveOptionsOrArgv,
  searchCommandChain,
  searchCommandNameChain,
  validateCommandChain,
  validateCommandName,
} from '../helpers/index.js';
import { useLocale } from '../i18n/index.js';
import { messages } from '../i18n/messages.js';
import type { ParseOptions } from '../types/type-argv.js';
import type {
  Command,
  CommandContext,
  CommandHandlerFunction,
  CommandName,
  HandlerContext,
} from '../types/type-command.js';
import type {
  CommandBuilder as CommandBuilderType,
  CommandNameToContext,
  GetCommandNameToContext,
  MergeCommandNameToContext,
} from '../types/type-command-builder.js';
import type { CommandBuilderOptions } from '../types/type-command-builder.js';
import type {
  FlagOptions,
  Flags,
  FlagsWithBuiltin,
} from '../types/type-flag.js';
import type {
  LocaleMessageResolverExtraOptions,
  LocaleMessagesObject,
  SupportedLocales,
} from '../types/type-locale-messages.js';
import type { Plugin } from '../types/type-plugin.js';
import type {
  WizardEventContext,
  WizardOptions,
} from '../types/type-wizard.js';
import type { GlobalInterceptorHandler } from '../types/type-wizard-global-flags.js';
import type { CliPipelineContext } from '../types/type-wizard-pipeline.js';
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
  GlobalFlags extends Flags = FlagsWithBuiltin,
> extends EventEmitter<WizardEventContext<NameToContext>> {
  #logger: Logger;
  #locale: SupportedLocales = 'en';
  #localeMessages: LocaleMessagesObject;
  #errorHandlers: ((err: unknown) => void)[] = [];
  #cliPipeline: Pipeline<CliPipelineContext>;
  #commandBuilder: CommandBuilderType<CommandName>;
  #commandChain: Command<CommandName>[] = [];
  #commandMap: Map<CommandName, Command<CommandName>> = new Map();
  #interceptors: GlobalInterceptorHandler<GlobalFlags>[] = [];
  #globalFlags: Flags;

  constructor(
    private options: Exclude<WizardOptions, 'logLevel' | 'noColor'> &
      Required<Pick<WizardOptions, 'logLevel' | 'noColor'>>
  ) {
    super();
    this.#locale = options.locale ?? resolveLocale();
    this.#globalFlags = createBuiltinFlags(this.#locale) as Flags;
    this.setupLogger({
      noColor: options.noColor,
      logLevel: options.logLevel,
    });
    if (options.errorHandler) {
      this.#errorHandlers.push(options.errorHandler);
    }
    this.#localeMessages = mergeLocaleMessages(
      'cli',
      messages,
      options.localeMessages
    );
    this.setupRootCommand();
    this.interceptor(createBuiltinInterceptor(this));
  }

  /**
   * @description
   * Sets up the logger.
   *
   * @param overrideOptions The override options.
   */
  public setupLogger(loggerOptions: {
    noColor?: boolean;
    logLevel?: LogLevel;
  }) {
    const { logLevel = DefaultLogLevel, noColor = DefaultNoColor } =
      loggerOptions;
    this.#logger = createLogger({
      name: WizardName,
      thresholdLevel: logLevel,
    })
      .use(
        createStdoutPlugin({
          noColor,
        })
      )
      .build();
  }

  /**
   * @description
   * Sets up the root command.
   */
  private setupRootCommand() {
    if (this.#commandBuilder) {
      return;
    }
    this.#commandBuilder = createCommandBuilder<CommandName>(Root, {
      description: () => rootName,
    });
  }

  /**
   * @description
   * Resets the pipeline.
   */
  private resetPipeline() {
    this.#cliPipeline = new Pipeline();
    this.#commandChain = [];
    this.#commandMap.clear();
  }

  /**
   * @description
   * Handles the error.
   */
  private handleError(e: unknown) {
    if (this.#errorHandlers.length > 0) {
      for (const errorHandler of this.#errorHandlers) {
        errorHandler(e);
      }
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
  private setupInterceptorPipeline() {
    if (this.#interceptors.length === 0) {
      return;
    }

    for (const interceptor of this.#interceptors) {
      this.#cliPipeline.use(async (ctx, next) => {
        if (!interceptor) {
          return;
        }
        const deepCtx = simpleDeepClone(ctx);
        await interceptor(
          {
            unknownFlags: deepCtx.unknownFlags,
            flags: pickFlags(deepCtx.flags, this.#globalFlags) as GlobalFlags,
            logger: this.#logger,
            locale: this.#locale,
            i18n: this.i18n,
          },
          next
        );
      });
    }
  }

  /**
   * @description
   * Sets up the command pipeline.
   *
   * @param parsedFlags The parsed flags.
   */
  private setupCommandPipeline(
    calledCommandName: CommandName,
    commandChain: Command<CommandName>[]
  ) {
    for (const command of commandChain) {
      this.#cliPipeline.use(async (ctx, next) => {
        await this.executeResolveOrHandler(
          calledCommandName,
          commandChain,
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
    calledCommandName: CommandName,
    commandPipeline: Command<Name>[],
    command: Command<Name>,
    ctx: CliPipelineContext,
    next: Parameters<Parameters<Pipeline<CliPipelineContext>['use']>[number]>[1]
  ) {
    const name = command.name;
    const inputCommandFlags = {
      ...this.#globalFlags,
      ...(command.flags ?? {}),
    };
    const commandBasicInfo = this.getCommandHandlerResultWithI18n(command);

    // check has subCommand
    const subCommands = command.subCommands || [];

    if (calledCommandName !== name && subCommands.length > 0) {
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
      throw new CommandHandlerNotFoundError(this.#locale, {
        cmdName: formatCommandName(name),
      });
    }

    handler({
      ...commandBasicInfo,
      ctx: ctx.ctx,
      unknownFlags: ctx.unknownFlags,
      flags: pickFlags(ctx.flags, inputCommandFlags),
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
   * Get the handler result with i18n.
   *
   * @param command The command.
   * @returns The handler result.
   */
  private getCommandHandlerResultWithI18n<Name extends CommandName>(
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
      logger: this.#logger,
      locale: this.#locale,
      i18n: this.i18n,
    };
  }

  /**
   * @description
   * Mounts the CLI pipeline, including argument parsing and error handling.
   * 1. Parses command line arguments and flags, sets them on ctx, and calls setupCommandPipeline.
   * 2. Mounts error handling middleware to catch and handle errors during execution.
   */
  private preparePipelineContext(argvOptions: ParseOptions) {
    try {
      const commandMap = commandTreeToMap(this.#commandBuilder);
      const allCommandNames = Array.from(commandMap.keys());

      for (const commandName of allCommandNames) {
        if (!validateCommandName(commandName)) {
          throw new InvalidCommandNameError(this.#locale, {
            cmdName: formatCommandName(commandName),
          });
        }
      }

      const [calledCommand, calledCommandName] = resolveCommand(
        this.#locale,
        commandMap,
        simpleDeepClone(argvOptions),
        this.#globalFlags
      );

      const inputCommandFlags = {
        ...this.#globalFlags,
        ...(calledCommand?.flags ?? {}),
      };

      const parsedFlags = parseFlags(
        inputCommandFlags,
        simpleDeepClone(argvOptions)
      );

      // If no command is called, return the parsed flags
      if (!calledCommandName) {
        return parsedFlags;
      }

      //get command pipeline, eg: build.evolve.mini
      const commandChain = searchCommandChain(calledCommandName, commandMap);
      for (const [cmdName, cmd] of commandMap) {
        this.#commandMap.set(cmdName, cmd);
      }
      this.#commandChain = commandChain;

      // Root command does not need to be validated
      if (calledCommandName === Root) {
        return parsedFlags;
      }

      // Ensure the found pipeline matches the actual execution pipeline
      validateCommandChain(
        this.#locale,
        inputCommandFlags,
        parsedFlags,
        commandChain
      );
      this.setupCommandPipeline(calledCommandName, commandChain);
      return parsedFlags;
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
    const argvOptions = resolveOptionsOrArgv(optionsOrArgv);
    this.resetPipeline();
    this.setupInterceptorPipeline();
    const pipelineContext = this.preparePipelineContext(argvOptions);
    if (!pipelineContext) {
      return;
    }
    this.#cliPipeline.use(async (_, next, error) => {
      if (error) {
        this.handleError(error);
      }
      await next();
    });

    if (argvOptions.run) {
      process.title = this.name;
      this.#cliPipeline.execute({
        ...pipelineContext,
        optionsOrArgv,
      });
    }
  }

  /**
   * @description
   * Registers a command by builder.
   *
   * @param builder The command builder.
   * @returns The wizard instance.
   */
  public register<
    CommandBuilder extends CommandBuilderType<any, any, any, any, any>,
  >(
    builder: CommandBuilder
  ): Wizard<
    MergeCommandNameToContext<
      NameToContext,
      GetCommandNameToContext<CommandBuilder>
    >
  >;

  /**
   * @description
   * Registers a command by name and options.
   *
   * @param name The command name.
   * @param options The command builder options.
   * @returns The wizard instance.
   */
  public register<
    Name extends CommandName,
    NewNameToContext extends CommandNameToContext = { [K in Name]: {} },
  >(
    name: Name,
    options: CommandBuilderOptions & {
      handler?: CommandHandlerFunction<HandlerContext<Name, {}, {}>>;
    }
  ): Wizard<MergeCommandNameToContext<NameToContext, NewNameToContext>>;

  public register(
    builderOrName: any,
    options?: CommandBuilderOptions & {
      handler?: CommandHandlerFunction<any>;
    }
  ) {
    if (typeof builderOrName === 'string' && options) {
      // (name, options) overload
      const { handler, ...rest } = options;
      const builder = createCommandBuilder(
        builderOrName,
        rest as CommandBuilderOptions
      ).handler(handler || (() => {}));
      return this.register(builder);
    } else {
      // (builder) overload
      const builder = builderOrName as CommandBuilderType;
      this.#commandBuilder = this.#commandBuilder.use(builder);
      return this;
    }
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
      MergeCommandNameToContext<NameToContext, PluginCommandMapping>,
      GlobalFlags
    >
  ): Wizard<
    MergeCommandNameToContext<NameToContext, PluginCommandMapping>,
    GlobalFlags
  > {
    this.#localeMessages = mergeLocaleMessages(
      'plugins',
      this.#localeMessages,
      plugin.localeMessages
    );

    return plugin.setup(this, {
      name: plugin.name
        ? localeMessageValue(this.i18n.t, plugin.name)
        : undefined,
      logLevel: this.options.logLevel,
      noColor: this.options.noColor,
    }) as unknown as Wizard<
      MergeCommandNameToContext<NameToContext, PluginCommandMapping>,
      GlobalFlags
    >;
  }

  /**
   * @description
   * Registers a global interceptor.
   *
   * @param interceptor The interceptor.
   * @returns The wizard instance.
   */
  public interceptor(interceptor: GlobalInterceptorHandler<GlobalFlags>) {
    this.#interceptors.push(interceptor);
    return this;
  }

  /**
   * @description
   * Sets the global flags.
   *
   * @param flags The flags to set.
   * @returns The wizard instance.
   */
  public flag<
    Name extends string,
    NewFlagOptions extends FlagOptions,
    NewGlobalFlags extends Record<Name, NewFlagOptions>,
  >(
    name: Name,
    options: NewFlagOptions
  ): Wizard<NameToContext, DeepPartial<NewGlobalFlags> & GlobalFlags> {
    this.#globalFlags[name] = {
      ...options,
    };
    return this as unknown as Wizard<
      NameToContext,
      DeepPartial<NewGlobalFlags> & GlobalFlags
    >;
  }

  /**
   * @description
   * Set the error handler.
   *
   * @param handler The error handler.
   * @returns The wizard instance.
   */
  public errorHandler(handler: (err: any) => void) {
    this.#errorHandlers.push(handler);
    return this;
  }

  /**
   * @description
   * Get the i18n extra options.
   *
   * @returns The i18n extra options.
   */
  private getI18nExtraOptions(): LocaleMessageResolverExtraOptions {
    const commandNameChain = searchCommandNameChain(this.#commandChain);
    return {
      commands: commandNameChain,
    };
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
    const t = useLocale(this.#locale, this.#localeMessages, this.#logger);
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
  public get locale(): SupportedLocales {
    return this.#locale;
  }

  /**
   * @description
   * Get the command map of the wizard.
   *
   * @returns The command map of the wizard.
   */
  public get commandMap() {
    return commandMapWithI18n(this.i18n.t, simpleDeepClone(this.#commandMap));
  }

  /**
   * @description
   * Get the command chain of the wizard.
   *
   * @returns The command chain of the wizard.
   */
  public get commandChain() {
    return commandChainWithI18n(
      this.i18n.t,
      simpleDeepClone(this.#commandChain)
    );
  }

  /**
   * @description
   * Get the global flags of the wizard.
   *
   * @returns The global flags of the wizard.
   */
  public get globalFlags() {
    return globalFlagsWithI18n(this.i18n.t, simpleDeepClone(this.#globalFlags));
  }
}
