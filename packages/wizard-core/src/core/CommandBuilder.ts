import type {
  Command as CommandType,
  CommandContext,
  CommandHandlerFunction,
  CommandResolverFunction,
  HandlerContext,
  ResolverContext,
} from '../types/type-command.js';
import type {
  CommandBuilder as CommandBuilderType,
  CommandBuilderOptions,
  ReturnTypeForUseFunction,
} from '../types/type-command-builder.js';
import type { Flags } from '../types/type-flag.js';
import type { RootType } from '../types/type-wizard.js';
import { Command } from './Command.js';

export class CommandBuilder<
  Name extends string | RootType = string,
  Context extends CommandContext = CommandContext,
  SubCommandContext extends object = object,
  CommandMapping extends Record<string, CommandContext> = {
    [K in Name]: Context;
  },
  CommandFlags extends Flags = Flags,
> implements
    CommandBuilderType<
      Name,
      Context,
      SubCommandContext,
      CommandMapping,
      CommandFlags
    >
{
  private name: Name;
  private options: CommandBuilderOptions;
  private command: CommandType<Name, Context, SubCommandContext, CommandFlags>;

  constructor(
    name: Name,
    options: CommandBuilderOptions,
    command?: CommandType<Name, Context, SubCommandContext, CommandFlags>,
    subCommands?: CommandType<any, any, any, any>[]
  ) {
    this.name = name;
    this.options = options;
    this.command =
      command ||
      new Command<Name, Context, SubCommandContext, CommandFlags>(
        name,
        options
      );
    for (const subCommand of subCommands || []) {
      subCommand.setParentCommand(this.command);
    }
    this.command.setSubCommands(subCommands || []);
  }

  use<SubCommandBuilders extends CommandBuilderType<any, any, any, any>[]>(
    ...subCommands: SubCommandBuilders
  ): ReturnTypeForUseFunction<
    Name,
    Context,
    SubCommandContext,
    CommandMapping,
    SubCommandBuilders,
    CommandFlags
  > {
    return new CommandBuilder(
      this.name,
      this.options,
      this.command,
      subCommands.map((p) => p.getCommand())
    ) as unknown as ReturnTypeForUseFunction<
      Name,
      Context,
      SubCommandContext,
      CommandMapping,
      SubCommandBuilders,
      CommandFlags
    >;
  }

  resolver(
    fn: CommandResolverFunction<ResolverContext<Context>, SubCommandContext>
  ): CommandBuilderType<
    Name,
    Context,
    SubCommandContext,
    CommandMapping,
    CommandFlags
  > {
    this.command.setResolver(fn);
    return this;
  }

  handler(
    fn: CommandHandlerFunction<HandlerContext<Name, Context, CommandFlags>>
  ): CommandBuilderType<
    Name,
    Context,
    SubCommandContext,
    CommandMapping,
    CommandFlags
  > {
    this.command.setHandler(fn);
    return this;
  }

  flags<SetupFlags extends Flags>(
    flags: SetupFlags
  ): CommandBuilder<
    Name,
    Context,
    SubCommandContext,
    CommandMapping,
    SetupFlags
  > {
    this.command.setFlags(flags as unknown as CommandFlags);
    return this as unknown as CommandBuilder<
      Name,
      Context,
      SubCommandContext,
      CommandMapping,
      SetupFlags
    >;
  }

  getCommand(): CommandType<Name, Context, SubCommandContext, CommandFlags> {
    return this.command;
  }
}

// const rootCmd = defineCommand<'startCmd', { start: string }>(
//   'startCmd',
//   'start command description'
// ).use(
//   defineCommand<'aCmd', { a: string; b: number }>(
//     'aCmd',
//     'a command description'
//   )
//     .use(
//       defineCommand<'wCmd', { w: { w1: string } }>(
//         'wCmd',
//         'w command description'
//       ).use(
//         defineCommand<'MMCmd', { MM: { MM1: string } }>(
//           'MMCmd',
//           'MM command description'
//         ),
//         defineCommand<'WWCmd', { WW: { WW1: string } }>(
//           'WWCmd',
//           'WW command description'
//         ),
//         defineCommand<'WW2Cmd', { WW2: { WW21: string } }>(
//           'WW2Cmd',
//           'WW2 command description'
//         ),
//         defineCommand<'WW3Cmd', { WW3: { WW31: string } }>(
//           'WW3Cmd',
//           'WW3 command description'
//         )
//       )
//     )
//     .flags({
//       projectCwd: {
//         type: String,
//         default: () => '/a/b/c',
//         description: 'project cwd',
//       },
//     })
//     .handler((ctx) => {
//       console.log(ctx);
//     }),
//   defineCommand<'wCmd', { w: { w1: string } }>('wCmd', 'w command description')
//     .use(
//       defineCommand<'MMCmd', { MM: { MM1: string } }>(
//         'MMCmd',
//         'MM command description'
//       ),
//       defineCommand<'WWCmd', { WW: { WW1: string } }>(
//         'WWCmd',
//         'WW command description'
//       ),
//       defineCommand<'WW2Cmd', { WW2: { WW21: string } }>(
//         'WW2Cmd',
//         'WW2 command description'
//       ),
//       defineCommand<'WW3Cmd', { WW3: { WW31: string } }>(
//         'WW3Cmd',
//         'WW3 command description'
//       )
//     )
//     .use(
//       defineCommand<'YYCmd', { YY: { YY1: string } }>(
//         'YYCmd',
//         'YY command description'
//       ).use(
//         defineCommand<'ZZCmd', { ZZ: { ZZ1: string } }>(
//           'ZZCmd',
//           'ZZ command description'
//         )
//       )
//     )
//     // .resolver({
//     //   MM: {
//     //     MM1: '12',
//     //   },
//     //   WW: {
//     //     WW1: 'WW1',
//     //   },
//     //   WW2: {
//     //     WW21: 'WW21',
//     //   },
//     //   WW3: {
//     //     WW31: 'WW31',
//     //   },
//     //   YY: {
//     //     YY1: 'YY1',
//     //   },
//     // })
//     .resolver((ctx) => {
//       return {
//         WIZARD: 'WIZARD',
//         MM: {
//           MM1: '12',
//         },
//         WW: {
//           WW1: 'WW1',
//         },
//         WW2: {
//           WW21: 'WW21',
//         },
//         WW3: {
//           WW31: 'WW31',
//         },
//         YY: {
//           YY1: 'YY1',
//         },
//       };
//     })
//     .handler((ctx) => {
//       console.log(ctx);
//     })
// );

// type AllMap =
//   typeof rootCmd extends CommandBuilderType<any, any, any, infer AM>
//     ? AM
//     : never;

// type Keys = keyof AllMap;

// type aCmdValue = AllMap['startCmd.wCmd.WWCmd'];

// const md2 = defineCommand<'aCmd', { a: string; b: number }>(
//   'aCmd',
//   'a command description'
// ).flags({
//   projectCwd: {
//     type: String,
//     default: () => '/a/b/c',
//     description: 'project cwd',
//   },
// });

// md2.handler((ctx) => {
//   console.log(ctx);
// });
