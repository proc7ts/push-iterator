import { describe, expect, it } from '@jest/globals';
import { iteratorOf } from '../base';
import { overNone, overOne } from '../construction';
import { itsEmpty } from './its-empty';
import { itsIterator } from './its-iterator';

describe('itsEmpty', () => {
  describe('over array', () => {
    it('returns `true` for empty array', () => {
      expect(itsEmpty([])).toBe(true);
    });
    it('returns `false` for non-empty array', () => {
      expect(itsEmpty([1])).toBe(false);
    });
  });

  describe('over raw iterable', () => {
    it('returns `true` for empty iterable', () => {
      expect(
        itsEmpty({
          [Symbol.iterator]: () => ({
            next: () => ({ done: true, value: 'ok' }),
          }),
        }),
      ).toBe(true);
    });
    it('returns `false` for non-empty iterable', () => {
      expect(itsEmpty([1].values())).toBe(false);
    });
  });

  describe('over push iterable', () => {
    it('returns `true` for empty iterable', () => {
      expect(itsEmpty(overNone())).toBe(true);
    });
    it('returns `false` for non-empty iterable', () => {
      expect(itsEmpty(overOne(1))).toBe(false);
    });
  });

  describe('over iterable with push iterator', () => {
    it('returns `true` for empty iterable', () => {
      expect(
        itsEmpty({
          [Symbol.iterator]: () => iteratorOf(overNone()),
        }),
      ).toBe(true);
    });
    it('returns `false` for non-empty iterable', () => {
      expect(
        itsEmpty({
          [Symbol.iterator]: () => itsIterator([1]),
        }),
      ).toBe(false);
    });
  });
});
