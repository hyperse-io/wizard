import type {
  Command,
  CommandContext,
  CommandName,
  CommandOptions,
  CommandProcessFunction,
  CommandResolveSubContextFunction,
  ProcessContext,
  ResolveSubContextCtx,
} from '../types/type-command.js';
import type { Flags } from '../types/type-flag.js';
import type { LocaleMessageResolver } from '../types/type-locale-messages.js';

/**
 * @description
 * The implementation of the command.
 *
 * @template Name - The type of the command name.
 * @template Context - The type of the command context.
 * @template SubCommandContext - The type of the sub-command context.
 * @template CommandFlags - The type of the command flags.
 */
class CommandImpl<
  Name extends CommandName = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandFlags extends Flags = Flags,
> implements Command<Name, Context, SubCommandContext, CommandFlags>
{
  private cmdName: Name;
  private cmdDescription: LocaleMessageResolver;
  private cmdExample: LocaleMessageResolver | undefined;
  private cmdHelp: LocaleMessageResolver | undefined;
  private cmdFlags: CommandFlags;
  private cmdSubCommands: Command<any, any, any, any>[] = [];
  private cmdParentCommand: Command<any, any, any, any>;
  private cmdResolveSubContextFn: CommandResolveSubContextFunction<
    ResolveSubContextCtx<Name, Context>,
    SubCommandContext
  >;
  private cmdProcessFn: CommandProcessFunction<
    ProcessContext<Name, Context, CommandFlags>
  >;
  private cmdConfigFile?: string;

  constructor(name: Name, options: CommandOptions) {
    this.cmdName = name;
    this.cmdDescription = options.description;
    this.cmdExample = options.example;
    this.cmdHelp = options.help;
  }

  get name() {
    return this.cmdName;
  }

  get description() {
    return this.cmdDescription;
  }

  get example() {
    return this.cmdExample;
  }

  get help() {
    return this.cmdHelp;
  }

  get flags() {
    return this.cmdFlags;
  }

  get parentCommand() {
    return this.cmdParentCommand;
  }

  get subCommands() {
    return this.cmdSubCommands;
  }

  get configFile() {
    return this.cmdConfigFile;
  }

  get resolveSubContext() {
    return this.cmdResolveSubContextFn;
  }

  get process() {
    return this.cmdProcessFn;
  }

  setFlags(flags: CommandFlags): void {
    this.cmdFlags = flags;
  }

  setParentCommand<ParentCommandType extends Command<any, any, any, any>>(
    parentCommand: ParentCommandType
  ) {
    this.cmdParentCommand = parentCommand;
  }

  setSubCommands<SubCommandType extends Command<any, any, any, any>>(
    subCommands: SubCommandType[]
  ) {
    this.cmdSubCommands = [...this.cmdSubCommands, ...subCommands];
  }

  setResolveSubContext(
    fn: CommandResolveSubContextFunction<
      ResolveSubContextCtx<Name, Context>,
      SubCommandContext
    >
  ) {
    this.cmdResolveSubContextFn = fn;
  }

  setProcess(
    fn: CommandProcessFunction<ProcessContext<Name, Context, CommandFlags>>
  ): void {
    this.cmdProcessFn = fn;
  }

  setConfigFile(configFile: string): void {
    this.cmdConfigFile = configFile;
  }
}

/**
 * @description
 * Create a command instance.
 *
 * This function initializes and returns a command instance (CommandImpl), which can be further configured with process, resolveSubContext, subcommands, arguments, and flags.
 *
 * @template Name - The type of the command name, usually a string or RootType.
 * @template Context - The type of the command context, defaults to CommandContext.
 * @template SubCommandContext - The type of the sub-command context, defaults to object.
 * @template CommandFlags - The type of the command flags, defaults to Flags.
 *
 * @param {CommandBuilderOptions} options - The command options, including description, usage, and other metadata.
 *
 * @returns Returns a command instance for further configuration.
 */
export const createCommand = <
  Name extends CommandName = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandFlags extends Flags = Flags,
>(
  name: Name,
  options: CommandOptions
) =>
  new CommandImpl<Name, Context, SubCommandContext, CommandFlags>(
    name,
    options
  );
