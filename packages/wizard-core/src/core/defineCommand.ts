import type {
  Command,
  CommandOptions,
  CommandWithHandler,
  HandlerContext,
  HandlerInCommand,
} from '../types/typeCommand.js';
import type { RootType } from '../types/typeWizard.js';

/**
 * @description
 * Define a command.
 *
 * @docsCategory core
 * @docsPage Define Command
 * @param command The command to define.
 * @param handler The handler for the command.
 * @returns The command.
 */
export const defineCommand = <
  N extends string | RootType,
  O extends CommandOptions<[...P]>,
  P extends string[],
>(
  command: Command<N, O & CommandOptions<[...P]>>,
  handler?: HandlerInCommand<
    HandlerContext<Record<N, Command<N, O>> & Record<never, never>, N>
  >
): CommandWithHandler<N, O & CommandOptions<[...P]>> => ({
  ...command,
  handler,
});
