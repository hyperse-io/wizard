import { simpleDeepClone } from '@hyperse/deep-merge';
import { createLogger, type Logger, LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';
import { Pipeline } from '@hyperse/pipeline';
import { Root, rootName, WizardName } from '../constants.js';
import { CommandHandlerNotFoundError } from '../errors/CommandHandlerNotFoundError.js';
import { EventEmitter } from '../events/EventEmitter.js';
import { globalFlagsWithI18n } from '../helpers/helper-global-flags-i18n.js';
import { mergeMessages } from '../helpers/helper-merge-messages.js';
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
} from '../helpers/index.js';
import { useLocale } from '../i18n/index.js';
import { messages } from '../i18n/messages.js';
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
import type { FlagOptions } from '../types/type-flag.js';
import type {
  LocaleMessageResolverExtraOptions,
  LocaleMessagesObject,
  SupportedLocales,
} from '../types/type-locale-messages.js';
import type { Plugin } from '../types/type-plugin.js';
import type {
  GlobalFlagHandlerParameters,
  GlobalFlags,
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
  #logger: Logger;
  #locale: SupportedLocales = 'en';
  #localeMessages: LocaleMessagesObject;
  #errorHandlers: ((err: unknown) => void)[] = [];
  #cliPipeline: Pipeline<PipelineContext>;
  #commandBuilder: CommandBuilderType<CommandName>;
  #commandChain: Command<CommandName>[] = [];
  #commandMap: Map<CommandName, Command<CommandName>> = new Map();
  #globalFlags: GlobalFlags = new Map();

  constructor(private options: WizardOptions) {
    super();
    this.#locale = options.locale ?? resolveLocale();
    this.#logger = createLogger({
      name: WizardName,
      thresholdLevel: options.thresholdLogLevel ?? LogLevel.Info,
    })
      .use(
        createStdoutPlugin({
          noColor: options.noColor ?? false,
        })
      )
      .build();
    if (options.errorHandler) {
      this.#errorHandlers.push(options.errorHandler);
    }
    this.#localeMessages = mergeMessages(
      'cli',
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
    this.#cliPipeline.use(async (ctx, next) => {
      const { flags } = ctx;
      Object.keys(flags).forEach((flagName) => {
        const globalFlag = this.#globalFlags.get(flagName);
        globalFlag?.handler?.({
          ...ctx,
          logger: this.#logger,
          locale: this.#locale,
          i18n: this.i18n,
        });
      });
      await next();
    });
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
    ctx: PipelineContext,
    next: Parameters<Parameters<Pipeline<PipelineContext>['use']>[number]>[1]
  ) {
    const name = command.name;
    const definedFlags = command.flags || {};
    const commandBasicInfo = this.getCommandBasicInfoWithI18n(command);

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
      logger: this.#logger,
      locale: this.#locale,
      i18n: this.i18n,
    };
  }

  private getI18nExtraOptions(): LocaleMessageResolverExtraOptions {
    const commandNameChain = searchCommandNameChain(this.#commandChain);
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
      const commandMap = commandTreeToMap(this.#commandBuilder);

      const [calledCommand, calledCommandName] = resolveCommand(
        this.#locale,
        commandMap,
        simpleDeepClone(argvOptions)
      );

      const inputCommandFlags = {
        ...Object.fromEntries(this.#globalFlags),
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
      const inputCommandNameChain = commandChain.map((cmd) => cmd.name);
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
        inputCommandNameChain,
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
    this.resetPipeline();
    this.setupInterceptorPipeline();
    const pipelineContext = this.preparePipelineContext(optionsOrArgv);
    if (!pipelineContext) {
      return;
    }
    this.#cliPipeline.use(async (_, next, error) => {
      if (error) {
        this.handleError(error);
      }
      await next();
    });
    this.#cliPipeline.execute({
      ...pipelineContext,
      optionsOrArgv,
    });
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
  ): any {
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
      const builder = builderOrName;
      this.#commandBuilder = this.#commandBuilder.use(builder);
      // Type cast for correct context
      return this as any;
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
      MergeCommandNameToContext<NameToContext, PluginCommandMapping>
    >
  ): Wizard<MergeCommandNameToContext<NameToContext, PluginCommandMapping>> {
    this.#localeMessages = mergeMessages(
      'plugins',
      this.#localeMessages,
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
   * Sets the global flags.
   *
   * @param flags The flags to set.
   * @returns The wizard instance.
   */
  public flag<Name extends string, Options extends FlagOptions>(
    name: Name,
    options: Options,
    handler?: (ctx: GlobalFlagHandlerParameters<Name>) => void
  ) {
    this.#globalFlags.set(name, {
      ...options,
      handler,
    });
    return this;
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
