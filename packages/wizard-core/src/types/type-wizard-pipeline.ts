import type { Pipeline } from '@hyperse/pipeline';
import type { ParseOptions } from './type-argv.js';
import type { CommandContext } from './type-command.js';
import type { Flags } from './type-flag.js';

/**
 * @description
 * The next function for the pipeline.
 */
export type PipelineNextFunction = Parameters<
  Parameters<Pipeline<CliPipelineContext>['use']>[number]
>[1];

/**
 * @description
 * The context for the pipeline.
 */
export type CliPipelineContext = {
  /**
   * The arguments.
   */
  args: string[];
  /**
   * The end of file arguments.
   */
  eofArgs: string[];
  /**
   * The flags.
   */
  flags: Flags;
  /**
   * The unknown flags.
   */
  unknownFlags?: {
    [flagName: string]: (string | boolean)[];
  };
  /**
   * The context.
   */
  ctx?: CommandContext;
  /**
   * The options or arguments.
   */
  optionsOrArgv: string[] | ParseOptions;
};
