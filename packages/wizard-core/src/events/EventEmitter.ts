import type {
  EventEmitterOptions,
  EventListener,
  EventMap,
} from '../types/typeEvent.js';

/**
 * @description
 * Event emitter implementation with type safety and auto-completion support.
 *
 * @docsCategory events
 * @docsPage EventEmitter
 */
export class EventEmitter<T extends EventMap = EventMap> {
  private _listeners: Map<keyof T, Set<EventListener<any>>> = new Map();
  private maxListeners: number = 10;
  private captureRejections: boolean = false;

  constructor(options?: EventEmitterOptions) {
    if (options?.maxListeners !== undefined) {
      this.maxListeners = options.maxListeners;
    }
    if (options?.captureRejections !== undefined) {
      this.captureRejections = options.captureRejections;
    }
  }

  /**
   * Add an event listener.
   */
  on<K extends keyof T | 'error'>(
    event: K,
    listener: EventListener<K extends keyof T ? T[K] : any>
  ): this {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }

    const eventListeners = this._listeners.get(event)!;

    if (eventListeners.size >= this.maxListeners) {
      console.warn(
        `EventEmitter: Possible EventEmitter memory leak detected. ${eventListeners.size} listeners added. ` +
          `Use emitter.setMaxListeners() to increase limit`
      );
    }

    eventListeners.add(listener);
    return this;
  }

  /**
   * Add a one-time event listener.
   */
  once<K extends keyof T | 'error'>(
    event: K,
    listener: EventListener<K extends keyof T ? T[K] : any>
  ): this {
    const onceListener = async (data: K extends keyof T ? T[K] : any) => {
      this.off(event, onceListener as EventListener<any>);
      await listener(data);
    };

    return this.on(event, onceListener as EventListener<any>);
  }

  /**
   * Remove an event listener.
   */
  off<K extends keyof T>(event: K, listener: EventListener<T[K]>): this {
    const eventListeners = this._listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        this._listeners.delete(event);
      }
    }
    return this;
  }

  /**
   * Remove all listeners for a specific event.
   */
  removeAllListeners<K extends keyof T>(event?: K): this {
    if (event) {
      this._listeners.delete(event);
    } else {
      this._listeners.clear();
    }
    return this;
  }

  /**
   * Emit an event.
   */
  emit<K extends keyof T>(event: K, data: T[K]): boolean {
    const eventListeners = this._listeners.get(event);
    if (!eventListeners || eventListeners.size === 0) {
      return false;
    }

    const promises: Promise<void>[] = [];

    for (const listener of eventListeners) {
      try {
        const result = listener(data);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        if (this.captureRejections) {
          this.emit('error' as K, error as T[K]);
        } else {
          throw error;
        }
      }
    }

    // Handle async listeners
    if (promises.length > 0) {
      Promise.allSettled(promises).then((results) => {
        const rejected = results.filter(
          (result) => result.status === 'rejected'
        );
        if (rejected.length > 0 && this.captureRejections) {
          for (const result of rejected) {
            if (result.status === 'rejected') {
              this.emit('error' as K, result.reason as T[K]);
            }
          }
        }
      });
    }

    return true;
  }

  /**
   * Get the number of listeners for a specific event.
   */
  listenerCount<K extends keyof T>(event: K): number {
    const eventListeners = this._listeners.get(event);
    return eventListeners ? eventListeners.size : 0;
  }

  /**
   * Get all listeners for a specific event.
   */
  listeners<K extends keyof T>(event: K): EventListener<T[K]>[] {
    const eventListeners = this._listeners.get(event);
    return eventListeners ? Array.from(eventListeners) : [];
  }

  /**
   * Get all event names that have listeners.
   */
  eventNames(): (keyof T)[] {
    return Array.from(this._listeners.keys());
  }

  /**
   * Set the maximum number of listeners.
   */
  setMaxListeners(n: number): this {
    this.maxListeners = n;
    return this;
  }

  /**
   * Get the maximum number of listeners.
   */
  getMaxListeners(): number {
    return this.maxListeners;
  }

  /**
   * Get the raw listeners map (for internal use).
   */
  protected getListenersMap(): Map<keyof T, Set<EventListener<any>>> {
    return this._listeners;
  }
}
