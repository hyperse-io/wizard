/**
 * @description
 * The event map type.
 *
 * @docsCategory types
 * @docsPage Event Map
 */
export type EventMap = Record<string | symbol, any>;

/**
 * @description
 * The event listener type.
 *
 * @docsCategory types
 * @docsPage Event Listener
 */
export type EventListener<T> = (data: T) => Promise<void> | void;

/**
 * @description
 * The event names type.
 *
 * @docsCategory types
 * @docsPage Event Names
 */
export type EventNames<T extends EventMap> = keyof T;

/**
 * @description
 * The event data type.
 *
 * @docsCategory types
 * @docsPage Event Data
 */
export type EventData<T extends EventMap, K extends EventNames<T>> = T[K];

/**
 * @description
 * The event emitter options type.
 *
 * @docsCategory types
 * @docsPage Event Emitter Options
 */
export interface EventEmitterOptions {
  maxListeners?: number;
  captureRejections?: boolean;
}

/**
 * @description
 * The create event map type.
 *
 * @docsCategory types
 * @docsPage Create Event Map
 */
export type CreateEventMap<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
};
