import { beforeEach, describe, expect, it } from '@jest/globals';
import { overKeys } from './over-keys';

describe('overKeys', () => {
  let obj: Record<PropertyKey, unknown>;

  beforeEach(() => {
    obj = {
      a: 1,
      [1]: 'two',
      [Symbol.iterator]: null,
    };
  });

  it('iterates over own object keys', () => {
    const keys = [...overKeys(obj)];

    expect(keys).toContain('a');
    expect(keys).toContain('1');
    expect(keys).toContain(Symbol.iterator);
    expect(keys).toHaveLength(3);
  });
});
