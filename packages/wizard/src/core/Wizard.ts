import { mergeOptions, simpleDeepClone } from '@hyperse/deep-merge';
import type { LogLevel } from '@hyperse/logger';
import { createLogger, type Logger } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';
import { Pipeline } from '@hyperse/pipeline';
import { Root, rootName, WizardName } from '../constants.js';
import { InvalidCommandNameError } from '../errors/CommandInvalidNameError.js';
import { CommandProcessNotFoundError } from '../errors/CommandProcessNotFoundError.js';
import { EventEmitter } from '../events/EventEmitter.js';
import { createBuiltinFlags } from '../helpers/helper-create-builtin-flags.js';
import { createBuiltinInterceptor } from '../helpers/helper-create-builtin-interceptor.js';
import { globalFlagsWithI18n } from '../helpers/helper-global-flags-i18n.js';
import { mergeLocaleMessages } from '../helpers/helper-locale-message-merge.js';
import { resolveCommand } from '../helpers/helper-resolve-command.js';
import { setupProcessEnv } from '../helpers/helper-setup-process-env.js';
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
import { coreMessages } from '../i18n/messages.js';
import type { ParseOptions } from '../types/type-argv.js';
import type {
  Command,
  CommandContext,
  CommandName,
  CommandProcessFunction,
  ProcessContext,
} from '../types/type-command.js';
import type {
  CommandBuilder as CommandBuilderType,
  CommandNameToContext,
  GetCommandNameToContext,
  MergeCommandNameToContext,
} from '../types/type-command-builder.js';
import type { CommandBuilderOptions } from '../types/type-command-builder.js';
import type { EventListener } from '../types/type-event.js';
import type {
  FlagOptions,
  Flags,
  FlagsWithBuiltin,
  ParseFlags,
} from '../types/type-flag.js';
import type {
  I18n,
  LocaleMessageResolverExtraOptions,
  LocaleMessagesObject,
  SupportedLocales,
} from '../types/type-locale-messages.js';
import type { Plugin, PluginSetupWizard } from '../types/type-plugin.js';
import type {
  WizardCommandContextLoaderResult,
  WizardEventContext,
  WizardOptions,
} from '../types/type-wizard.js';
import type { GlobalInterceptorHandler } from '../types/type-wizard-global-flags.js';
import type { CliPipelineContext } from '../types/type-wizard-pipeline.js';
import { createCommandBuilder } from './CommandBuilder.js';

/**
 * @description
 * The WizardWithUse type describes a Wizard instance that only exposes the core methods: use, on, and parse.
 * This type is mainly used for plugin systems and as the return type of the createWizard factory function,
 * ensuring that only the essential plugin registration, event listening, and command parsing interfaces are available.
 *
 * @template NameToContext - The mapping type from command names to their context, defining the supported commands and their context types.
 * @template GlobalFlags - The type of global flags supported by the CLI, defaulting to the built-in flags.
 *
 * @example
 * // Used for type constraints on the return value of plugin setup
 * const cli: WizardWithUse = createWizard({ ... });
 * cli.use(myPlugin).on('build', handler).parse();
 */
export type WizardWithUse<
  NameToContext extends CommandNameToContext = {},
  GlobalFlags extends Flags = FlagsWithBuiltin,
> = Pick<
  Wizard<NameToContext, GlobalFlags>,
  'use' | 'on' | 'parse' | 'name' | 'description' | 'version'
>;

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
> {
  #logger: Logger;
  #locale: SupportedLocales = 'en';
  #localeMessages: LocaleMessagesObject;
  #errorHandlers: ((err: unknown) => void | Promise<void>)[] = [];
  #cliPipeline: Pipeline<CliPipelineContext>;
  #commandBuilder: CommandBuilderType<CommandName>;
  #commandChain: Command<CommandName>[] = [];
  #commandMap: Map<string, Command<CommandName>> = new Map();
  #commandContextLoader:
    | ((
        globalFlags: ParseFlags<GlobalFlags>,
        configFile: string
      ) =>
        | WizardCommandContextLoaderResult<NameToContext>
        | Promise<WizardCommandContextLoaderResult<NameToContext>>)
    | undefined;
  #interceptors: GlobalInterceptorHandler<GlobalFlags>[] = [];
  #globalFlags: FlagsWithBuiltin;
  #pendingPlugins: Plugin<any, any, any, any>[] = [];
  #eventEmitter: EventEmitter<WizardEventContext<NameToContext>> =
    new EventEmitter<WizardEventContext<NameToContext>>();

  constructor(
    private options: Exclude<WizardOptions, 'logLevel' | 'noColor'> &
      Required<Pick<WizardOptions, 'logLevel' | 'noColor'>>
  ) {
    this.#locale = options.locale ?? resolveLocale();
    this.#globalFlags = createBuiltinFlags(this.#locale) as FlagsWithBuiltin;
    this.setupLogger({
      noColor: options.noColor,
      logLevel: options.logLevel,
    });
    if (options.errorHandler) {
      this.#errorHandlers.push(options.errorHandler);
    }
    this.#localeMessages = mergeLocaleMessages(
      'cli',
      coreMessages,
      options.localeMessages
    );
    this.setupRootCommand();
    this.interceptor(createBuiltinInterceptor(this));
  }

  /**
   * @description
   * Registers a listener for an event.
   *
   * @param event The event name.
   * @param listener The listener function.
   * @returns The wizard instance.
   */
  public on<K extends keyof WizardEventContext<NameToContext> | 'error'>(
    event: K,
    listener: EventListener<
      K extends keyof WizardEventContext<NameToContext>
        ? WizardEventContext<NameToContext>[K]
        : any
    >
  ): WizardWithUse<NameToContext, GlobalFlags> {
    this.#eventEmitter.on(event, listener);
    return this as unknown as WizardWithUse<NameToContext, GlobalFlags>;
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
    const { logLevel = this.options.logLevel, noColor = this.options.noColor } =
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
   * Sets up the context loader.
   *
   * @param contextLoader The context loader.
   */
  public setupContextLoader(
    contextLoader: (
      globalFlags: ParseFlags<GlobalFlags>,
      configFile: string
    ) =>
      | WizardCommandContextLoaderResult<NameToContext>
      | Promise<WizardCommandContextLoaderResult<NameToContext>>
  ) {
    this.#commandContextLoader = contextLoader;
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
   * Initialize any plugins enqueued via use() but not yet set up.
   * Runs once per parse() call before building pipelines.
   */
  private initializePendingPlugins() {
    if (!this.#pendingPlugins?.length) return;
    const plugins = simpleDeepClone(this.#pendingPlugins);
    for (const plugin of plugins) {
      this.#localeMessages = mergeLocaleMessages(
        'plugins',
        this.#localeMessages,
        plugin.localeMessages
      );
      const resolvedName = plugin.name
        ? localeMessageValue(this.i18n.t, plugin.name)
        : undefined;
      plugin.setup(this as PluginSetupWizard<NameToContext, GlobalFlags>, {
        name: resolvedName,
        logLevel: this.options.logLevel,
        noColor: this.options.noColor,
        logger: this.#logger,
      });
    }
  }

  /**
   * @description
   * Handles the error.
   */
  private async handleError(e: unknown) {
    if (this.#errorHandlers.length > 0) {
      for (const errorHandler of this.#errorHandlers) {
        await errorHandler(e);
      }
    } else {
      throw e;
    }
  }

  /**
   * @description
   * Sets up the command pipeline.
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
            flags: pickFlags<GlobalFlags>(deepCtx.flags, this.#globalFlags),
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
    calledCommandName: string,
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
   * Executes the resolveSubContext or process for the command.
   *
   * @param lastCommandName The name of the last command.
   * @param commandPipeline The command pipeline.
   * @param command The command.
   * @param ctx The context.
   * @param next The next function.
   * @returns The result.
   */
  private async executeResolveOrHandler<Name extends CommandName>(
    calledCommandName: string,
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

    if (
      calledCommandName !== formatCommandName(name) &&
      subCommands.length > 0
    ) {
      // check has subCommand
      const resolveSubContext = command.resolveSubContext || (() => {});
      let subContext: CommandContext;
      if (typeof resolveSubContext === 'function') {
        subContext = await resolveSubContext(commandBasicInfo);
      } else {
        subContext = resolveSubContext;
      }

      ctx.ctx = subContext;
      await next();
      return;
    }

    // check has process
    const process = command.process;

    if (!process) {
      throw new CommandProcessNotFoundError(this.#locale, {
        cmdName: formatCommandName(name),
      });
    }

    const commandNameChain = searchCommandNameChain(commandPipeline);
    const eventName = commandNameChain.join(
      '.'
    ) as keyof WizardEventContext<NameToContext>;

    const flags = pickFlags<typeof ctx.flags & FlagsWithBuiltin>(
      ctx.flags,
      inputCommandFlags
    );

    // merge global ctx and resolve ctx
    const resolveCtx = ctx.ctx ?? {};

    // load command context
    const configFile = command.configFile;
    let commandCtxWithLoader = {};
    if (configFile && this.#commandContextLoader) {
      const commandContextLoaderResult = await this.#commandContextLoader(
        pickFlags<GlobalFlags>(flags, this.#globalFlags),
        configFile
      );
      const commandCtxLoader = commandContextLoaderResult[eventName];
      if (typeof commandCtxLoader === 'function') {
        commandCtxWithLoader = await commandCtxLoader({
          flags:
            flags as WizardEventContext<NameToContext>[typeof eventName]['flags'],
        });
      } else {
        commandCtxWithLoader = commandCtxLoader ?? {};
      }
    }

    const processOptions = {
      ...commandBasicInfo,
      ctx: mergeOptions(commandCtxWithLoader, resolveCtx),
      unknownFlags: ctx.unknownFlags,
      flags: flags,
    };

    await process(processOptions);

    this.#eventEmitter.emit(
      eventName,
      processOptions as unknown as WizardEventContext<NameToContext>[typeof eventName]
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
  private async preparePipelineContext(argvOptions: ParseOptions) {
    try {
      const commandMap = commandTreeToMap(this.#commandBuilder);
      this.#commandMap = simpleDeepClone(commandMap);
      const allCommandNames = Array.from(commandMap.keys());

      if (allCommandNames.every((name) => name === formatCommandName(Root))) {
        this.#logger.warn(this.i18n.t('core.command.notProvider'));
      }

      for (const commandName of allCommandNames) {
        if (!validateCommandName(commandName)) {
          throw new InvalidCommandNameError(this.#locale, {
            cmdName: formatCommandName(commandName),
          });
        }
      }

      const [calledCommand, calledCommandNameChain] = resolveCommand(
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
      if (!calledCommandNameChain) {
        return parsedFlags;
      }

      //get command pipeline, eg: build.evolve.mini
      const commandChain = searchCommandChain(
        calledCommandNameChain,
        commandMap
      );

      this.#commandChain = commandChain;

      // Root command does not need to be validated
      if (calledCommandNameChain === formatCommandName(Root)) {
        return parsedFlags;
      }

      // Ensure the found pipeline matches the actual execution pipeline
      validateCommandChain(
        this.#locale,
        inputCommandFlags,
        parsedFlags,
        commandChain
      );
      const calledCommandName = calledCommandNameChain.split('.').pop();
      this.setupCommandPipeline(calledCommandName!, commandChain);

      return parsedFlags;
    } catch (error) {
      await this.handleError(error);
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
  public async parse(optionsOrArgv: string[] | ParseOptions = resolveArgv()) {
    const argvOptions = resolveOptionsOrArgv(optionsOrArgv);
    setupProcessEnv(argvOptions, this.#locale);
    this.initializePendingPlugins();
    this.resetPipeline();
    this.setupInterceptorPipeline();
    const pipelineContext = await this.preparePipelineContext(argvOptions);
    if (!pipelineContext) {
      return;
    }
    this.#cliPipeline.use(async (_, next, error) => {
      if (error) {
        await this.handleError(error);
      }
      await next();
    });

    if (argvOptions.run) {
      process.title = this.name;
      await this.#cliPipeline.execute({
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
  ): PluginSetupWizard<
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
      process?: CommandProcessFunction<ProcessContext<Name, {}, {}>>;
    }
  ): PluginSetupWizard<
    MergeCommandNameToContext<NameToContext, NewNameToContext>
  >;

  public register(
    builderOrName: any,
    options?: CommandBuilderOptions & {
      process?: CommandProcessFunction<any>;
    }
  ) {
    if (typeof builderOrName === 'string' && options) {
      // (name, options) overload
      const { process, ...rest } = options;

      const builder = createCommandBuilder(
        builderOrName,
        rest as CommandBuilderOptions
      ).process(process || (() => {}));
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
  public use<
    PluginCommandMapping extends CommandNameToContext,
    PluginGlobalFlags extends Flags = GlobalFlags,
  >(
    plugin: Plugin<
      NameToContext,
      MergeCommandNameToContext<NameToContext, PluginCommandMapping>,
      GlobalFlags,
      PluginGlobalFlags
    >
  ): WizardWithUse<
    MergeCommandNameToContext<NameToContext, PluginCommandMapping>,
    PluginGlobalFlags
  > {
    this.#pendingPlugins.push(plugin as unknown as Plugin<any, any, any, any>);
    return this as unknown as WizardWithUse<
      MergeCommandNameToContext<NameToContext, PluginCommandMapping>,
      PluginGlobalFlags
    >;
  }

  /**
   * @description
   * Registers a global interceptor.
   *
   * @param interceptor The interceptor.
   * @returns The wizard instance.
   */
  public interceptor(
    interceptor: GlobalInterceptorHandler<GlobalFlags>
  ): PluginSetupWizard<NameToContext, GlobalFlags> {
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
  ): PluginSetupWizard<NameToContext, NewGlobalFlags & GlobalFlags> {
    this.#globalFlags[name] = {
      ...options,
    };
    return this as unknown as PluginSetupWizard<
      NameToContext,
      NewGlobalFlags & GlobalFlags
    >;
  }
  /**
   * @description
   * Set the error handler.
   *
   * @param handler The error handler.
   * @returns The wizard instance.
   */
  public errorHandler(
    handler: (err: any) => void | Promise<void>
  ): PluginSetupWizard<NameToContext, GlobalFlags> {
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
  public get i18n(): I18n {
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
