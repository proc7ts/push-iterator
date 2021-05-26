import { describe, expect, it } from '@jest/globals';
import { itsMatch } from './its-match';

describe('itsMatch', () => {
  it('returns first matching element', () => {
    expect(itsMatch([1, 2, 3], el => el > 1)).toBe(2);
  });
  it('returns undefined when no elements match', () => {
    expect(itsMatch([1, 2, 3], el => el < 0)).toBeUndefined();
  });
});
