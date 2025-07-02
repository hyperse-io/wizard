import { resolveArgv } from '../../src/utils/resolveArgv.js';

describe('resolveArgv', () => {
  it('should return empty array if not Node or Deno', () => {
    vi.mock('is-platform', () => ({
      IS_NODE: false,
      IS_DENO: false,
      IS_ELECTRON: false,
    }));
    const result = resolveArgv();
    expect(result).toEqual([]);
  });

  it('should return process.argv slice from 2 in Node', () => {
    vi.mock('is-platform', () => ({
      IS_NODE: true,
      IS_DENO: false,
      IS_ELECTRON: false,
    }));
    process.argv = ['node', 'script.js', 'arg1', 'arg2'];
    console.log(resolveArgv());
    expect(resolveArgv()).toEqual(['arg1', 'arg2']);
  });

  it('should return process.argv slice from 1 in Electron', () => {
    vi.mock('is-platform', () => ({
      IS_NODE: true,
      IS_DENO: false,
      IS_ELECTRON: true,
    }));
    process.argv = ['electron', 'arg1', 'arg2'];
    expect(resolveArgv()).toEqual(['arg1', 'arg2']);
  });
});
