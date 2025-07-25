import chalk from 'chalk';
import type { FlagsWithI18n, I18n } from '@hyperse/wizard-core';
import { DELIMITER, INDENT } from '../constant.js';
import { gracefulFlagName } from './helper-string-utils.js';

const primitiveMap = new Map<any, string | undefined>([
  [Boolean, 'boolean'],
  [String, 'string'],
  [Number, 'number'],
]);

export function formatFlagType(type: any, hasDefault = false) {
  const res = primitiveMap.has(type) ? primitiveMap.get(type) : 'value';

  return res ? (hasDefault ? `[${res}]` : `<${res}>`) : '';
}

export const formatFlags = (t: I18n['t'], flags: FlagsWithI18n) => {
  const tableMessage: string[][] = [];
  for (const [name, flag] of Object.entries(flags)) {
    const hasDefault = flag.default !== undefined;
    const flagNameWithAlias: string[] = [gracefulFlagName(name)];
    if (flag.alias) {
      flagNameWithAlias.push(gracefulFlagName(flag.alias));
    }
    const items = [
      INDENT,
      chalk.blue(flagNameWithAlias.join(', ')),
      formatFlagType(flag.type, hasDefault),
    ];
    items.push(DELIMITER, flag.description);
    if (hasDefault) {
      items.push(
        `(${t('plugins.helpPlugin.message.default', {
          value: String(flag.default),
        })})`
      );
    }
    tableMessage.push(items);
  }
  return tableMessage;
};
