import type { FlagsWithI18n, I18n } from '@hyperse/wizard';
import { DELIMITER, INDENT } from '../constant.js';
import { chalk } from './helper-chalk.js';
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

/**
 * @description
 * Format the flag type for display in help messages.
 *
 * @param t - The i18n instance.
 * @param flags - The flags of a command.
 * @returns The formatted flag type string, e.g., "<string>", "[boolean]", etc.
 */
export const formatFlags = (t: I18n['t'], flags: FlagsWithI18n) => {
  const tableMessage: string[][] = [];
  for (const [name, flag] of Object.entries(flags)) {
    const hasDefault = flag.default !== undefined;
    const hasRequired = flag.required;
    const flagNameWithAlias: string[] = [
      flag.alias ? gracefulFlagName(flag.alias) + ', ' : '    ',
    ];
    flagNameWithAlias.push(gracefulFlagName(name));
    const items = [
      INDENT,
      chalk.blue(flagNameWithAlias.join('')),
      formatFlagType(flag.type, hasDefault),
    ];
    items.push(chalk.yellow(DELIMITER), flag.description);
    if (hasDefault) {
      items.push(
        `(${t('plugins.helpPlugin.message.default', {
          value: String(flag.default),
        })})${hasRequired ? ` [${t('plugins.helpPlugin.message.required')}]` : ''}`
      );
    }
    tableMessage.push(items);
  }
  return tableMessage;
};
