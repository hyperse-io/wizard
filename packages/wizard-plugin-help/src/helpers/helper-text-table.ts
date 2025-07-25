import stringWidth from 'string-width';
import textTable from 'text-table';

export const table = (items: string[][]) =>
  textTable(items, { stringLength: stringWidth });

export const splitTable = (items: string[][]) => table(items).split('\n');
