import { EventEmitter } from '../../src/events/EventEmitter.js';
import type { CreateEventMap } from '../../src/types/type-event.js';

describe('EventEmitter', () => {
  type TestEventMap = CreateEventMap<{
    'test:event': { data: string };
    'async:event': { data: string };
    others: { others: string };
  }>;

  let emitter: EventEmitter<TestEventMap>;

  beforeEach(() => {
    emitter = new EventEmitter<TestEventMap>();
  });

  test('should add and trigger event listeners', () => {
    const mockFn = vi.fn();
    emitter.on('error', (_e) => {});
    emitter.on('test:event', mockFn);

    emitter.emit('test:event', { data: 'test' });
    expect(mockFn).toHaveBeenCalledWith({ data: 'test' });
  });

  test('should handle once listeners', () => {
    const mockFn = vi.fn();
    emitter.once('test:event', mockFn);
    emitter.emit('test:event', { data: 'test1' });
    emitter.emit('test:event', { data: 'test2' });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ data: 'test1' });
  });

  test('should remove specific listeners', () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();
    emitter.on('test:event', mockFn1);
    emitter.on('test:event', mockFn2);
    emitter.off('test:event', mockFn1);
    emitter.emit('test:event', { data: 'test' });
    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();
  });

  test('should handle async listeners', async () => {
    const mockFn = vi.fn().mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return 'done';
    });
    emitter.on('async:event', mockFn);
    emitter.emit('async:event', { data: 'async test' });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(mockFn).toHaveBeenCalledWith({ data: 'async test' });
  });

  test('should respect maxListeners limit', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    const maxListeners = 2;
    emitter.setMaxListeners(maxListeners);
    for (let i = 0; i < maxListeners + 1; i++) {
      emitter.on('test:event', () => {});
    }
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('should handle error events with captureRejections', () => {
    const errorEmitter = new EventEmitter<TestEventMap>({
      captureRejections: true,
    });
    const errorMock = vi.fn();
    const error = new Error('Test error');
    errorEmitter.on('error', errorMock);
    errorEmitter.on('test:event', () => {
      throw error;
    });
    errorEmitter.emit('test:event', { data: 'test' });
    expect(errorMock).toHaveBeenCalledWith(error);
  });

  test('should return correct listener count', () => {
    const listener1 = () => {};
    const listener2 = () => {};
    emitter.on('test:event', listener1);
    emitter.on('test:event', listener2);
    expect(emitter.listenerCount('test:event')).toBe(2);
  });

  test('should return all event names with listeners', () => {
    emitter.on('test:event', () => {});
    emitter.on('async:event', () => {});
    const eventNames = emitter.eventNames();
    expect(eventNames).toContain('test:event');
    expect(eventNames).toContain('async:event');
    expect(eventNames.length).toBe(2);
  });

  test('should remove all listeners', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    emitter.on('test:event', listener1);
    emitter.on('async:event', listener2);
    emitter.removeAllListeners();
    emitter.emit('test:event', { data: 'test' });
    emitter.emit('async:event', { data: 'test' });
    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });
});
