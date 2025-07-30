import stringWidth from 'string-width';
import textTable from 'text-table';

/**
 * @description
 * Create a table from an array of strings.
 *
 * @param items - The items to create a table from.
 * @returns The created table.
 */
export const table = (items: string[][]) =>
  textTable(items, { stringLength: stringWidth });

/**
 * @description
 * Split the table into lines.
 *
 * @param items - The items to split.
 * @returns The split table.
 */
export const splitTable = (items: string[][]) => table(items).split('\n');
