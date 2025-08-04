import { describe, expect, it } from 'vitest';
import { pickFlags } from '../src/helpers/helper-pick-flags.js';
import type { Flags } from '../src/types/type-flag.js';

const baseFlags: Flags = {
  foo: { description: () => 'foo flag', type: String },
  bar: { description: () => 'bar flag', type: Boolean, default: false },
  baz: { description: () => 'baz flag', type: Number, default: 1 },
};

describe('pickFlags', () => {
  it('should pick only the specified flags', () => {
    const targetFlags: Flags = {
      foo: { description: () => 'foo flag', type: String },
      baz: { description: () => 'baz flag', type: Number, default: 1 },
    };
    const result = pickFlags(baseFlags, targetFlags);
    expect(Object.keys(result)).toEqual(['foo', 'baz']);
    expect(result.foo).toEqual(baseFlags.foo);
    expect(result.baz).toEqual(baseFlags.baz);
    expect(result.bar).toBeUndefined();
  });

  it('should return an empty object if targetFlags is empty', () => {
    const result = pickFlags(baseFlags, {});
    expect(result).toEqual({});
  });

  it('should return an empty object if baseFlags is empty', () => {
    const targetFlags: Flags = {
      foo: { description: () => 'foo flag', type: String },
    };
    const result = pickFlags({}, targetFlags);
    expect(result).toEqual({ foo: undefined });
  });

  it('should return undefined for missing keys in baseFlags', () => {
    const targetFlags: Flags = {
      notExist: { description: () => 'not exist', type: String },
    };
    const result = pickFlags(baseFlags, targetFlags);
    expect(result).toEqual({ notExist: undefined });
  });
});
