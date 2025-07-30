import { Chalk } from 'chalk';

export const chalk = new Chalk();

/**
 * @description
 * Setup chalk. If noColor is true, set the chalk level to 0.
 *
 * @param noColor - The no color.
 */
export const setupChalk = (noColor: boolean) => {
  if (noColor) {
    chalk.level = 0;
  }
};
