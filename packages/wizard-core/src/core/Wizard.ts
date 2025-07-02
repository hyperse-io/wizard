import { createLogger, type Logger, LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';
import { WizardName } from '../constants.js';
import { EventEmitter } from '../events/EventEmitter.js';
import { useLocale } from '../i18n/index.js';
import type {
  CommandEventMap,
  Commands,
  GlobalFlagOptions,
} from '../types/typeCommand.js';
import type { ParseOptions, WizardOptions } from '../types/typeWizard.js';
import { resolveLocale } from '../utils/resolveLocale.js';
import { resolveOptionsOrArgv } from '../utils/resolveOptionsOrArgv.js';

/**
 * @example
 * .name("Foo CLI") // Optional, defaults to scriptName
 * .description("A simple cli")
 * .version("1.0.0")
 * .command("foo", "A foo command")
 * .on("foo", (context) => {
 * 	 console.log("It works!");
 * })
 * .parse();
 */
export class Wizard<
  C extends Commands = {},
  GF extends GlobalFlagOptions = {},
> {
  // #argv: string[];
  // #commands = Object.create(null) as C;
  #locale = 'en';
  // #commandEmitter = new EventEmitter<CommandEventMap<C>>({}).on(
  //   'error',
  //   (e) => {
  //     this.#handleError(e);
  //   }
  // );
  private logger: ReturnType<Logger['build']>;

  constructor(private options: WizardOptions) {
    this.#locale = resolveLocale();
    this.logger = createLogger({
      name: WizardName,
      thresholdLevel: options.thresholdLogLevel ?? LogLevel.Info,
    })
      .use(
        createStdoutPlugin({
          noColor: options.noColor ?? false,
        })
      )
      .build();
  }

  /**
   * @description
   * Set the name of the wizard.
   *
   * @docsCategory core
   * @docsPage Wizard
   * @param name The name of the wizard.
   * @returns The wizard instance.
   */
  public get name() {
    return this.options.name;
  }

  /**
   * @description
   * Get the description of the wizard.
   *
   * @docsCategory core
   * @docsPage Wizard
   * @param description The description of the wizard.
   * @returns The wizard instance.
   */
  public get description() {
    return this.options.description;
  }

  /**
   * @description
   * Get the version of the wizard.
   *
   * @docsCategory core
   * @docsPage Wizard
   * @param version The version of the wizard.
   * @returns The wizard instance.
   */
  public get version() {
    return this.options.version;
  }

  /**
   * @description
   * Set the locale of the wizard.
   *
   * @docsCategory core
   * @docsPage Wizard
   * @param locale The locale to use.
   * @returns The wizard instance.
   */
  public locale(locale: string) {
    this.#locale = locale;
    return this;
  }

  /**
   * @description
   * Get the i18n instance.
   *
   * @docsCategory core
   * @docsPage Wizard
   * @returns The i18n instance.
   */
  public get i18n() {
    const t = useLocale(this.#locale);
    return {
      t,
    };
  }

  /**
   * @description
   * Parse the options or argv.
   *
   * @docsCategory core
   * @docsPage Wizard
   * @param optionsOrArgv The options or argv to parse.
   * @returns The wizard instance.
   */
  public parse(optionsOrArgv: string[] | ParseOptions) {
    const { argv, run } = resolveOptionsOrArgv(optionsOrArgv);
    // this.#argv = [...argv];
    if (run) {
      process.title = this.options.name ?? '';
      // this.#runMatchedCommand();
    }
    return this;
  }

  // #handleError(e: unknown) {
  //   // if (this.#errorHandlers.length > 0) {
  //   //   for (const cb of this.#errorHandlers) {
  //   //     cb(e);
  //   //   }
  //   // } else {
  //   //   throw e;
  //   // }
  //   // console.log(this.#commandEmitter);
  // }
}
