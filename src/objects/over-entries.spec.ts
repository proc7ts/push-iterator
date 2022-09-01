import { beforeEach, describe, expect, it } from '@jest/globals';
import { overEntries } from './over-entries';

describe('overEntries', () => {
  let obj: Record<PropertyKey, unknown>;

  beforeEach(() => {
    obj = {
      a: 1,
      [1]: 'two',
      [Symbol.iterator]: null,
    };
  });

  it('iterates over object entries', () => {
    const entries = [...overEntries(obj)];

    expect(entries).toContainEqual(['a', 1]);
    expect(entries).toContainEqual(['1', 'two']);
    expect(entries).toContainEqual([Symbol.iterator, null]);
    expect(entries).toHaveLength(3);
  });
});
