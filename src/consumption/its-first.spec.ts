import { describe, expect, it } from '@jest/globals';
import { iteratorOf } from '../base';
import { overMany, overNone } from '../construction';
import { itsFirst } from './its-first';

describe('itsFirst', () => {
  describe('over array', () => {
    it('returns first array element', () => {
      expect(itsFirst([1, 2, 3])).toBe(1);
    });
    it('returns `undefined` for empty array', () => {
      expect(itsFirst([])).toBeUndefined();
    });
  });

  describe('over raw iterable', () => {
    it('returns first iterable element', () => {
      expect(itsFirst(new Set([1, 2, 3]))).toBe(1);
    });
    it('returns `undefined` for empty iterable', () => {
      expect(itsFirst(new Set())).toBeUndefined();
    });
  });

  describe('over push iterable', () => {
    it('returns first iterable element', () => {
      expect(itsFirst(overMany(1, 2, 3))).toBe(1);
    });
    it('returns `undefined` for empty iterable', () => {
      expect(itsFirst(overNone())).toBeUndefined();
    });
  });

  describe('over iterable with push iterator', () => {
    it('returns first iterable element', () => {
      expect(
        itsFirst({
          [Symbol.iterator]: () => iteratorOf(overMany(1, 2, 3)),
        }),
      ).toBe(1);
    });
    it('returns `undefined` for empty iterable', () => {
      expect(
        itsFirst({
          [Symbol.iterator]: () => iteratorOf(overNone()),
        }),
      ).toBeUndefined();
    });
  });
});
