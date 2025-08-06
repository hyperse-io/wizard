/**
 * @description
 * The event map type.
 *
 * @template T - The type of the event data.
 * @returns {Record<string | symbol, any>} The event map.
 * @example
 * EventMap<{foo: string}> // { foo: string }
 */
export type EventMap = Record<string | symbol, any>;

/**
 * @description
 * The event listener type.
 *
 * @template T - The type of the event data.
 * @returns {Promise<void> | void} The event listener.
 * @example
 * EventListener<{foo: string}> // (data: {foo: string}) => Promise<void> | void
 */
export type EventListener<T> = (data: T) => Promise<void> | void;

/**
 * @description
 * The event names type.
 *
 * @template T - The type of the event map.
 * @returns {keyof T} The event names.
 * @example
 * EventNames<{foo: string}> // 'foo'
 */
export type EventNames<T extends EventMap> = keyof T;

/**
 * @description
 * The event data type.
 *
 * @template T - The type of the event map.
 * @template K - The type of the event name.
 * @returns {T[K]} The event data.
 * @example
 * EventData<{foo: string}, 'foo'> // string
 */
export type EventData<T extends EventMap, K extends EventNames<T>> = T[K];

/**
 * @description
 * The event emitter options type.
 *
 * @property {number} [maxListeners] - The maximum number of listeners for an event.
 * @property {boolean} [captureRejections] - Whether to capture rejections.
 */
export interface EventEmitterOptions {
  maxListeners?: number;
  captureRejections?: boolean;
}

/**
 * @description
 * The create event map type.
 *
 * @template T - The type of the event map.
 * @returns {object} The event map.
 * @example
 * CreateEventMap<{foo: string}> // { foo: string }
 */
export type CreateEventMap<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
};
