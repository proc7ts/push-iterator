import { beforeEach, describe, expect, it } from '@jest/globals';
import { overMany, reverseArray } from '../construction';
import { itsElements } from './its-elements';
import { itsIterator } from './its-iterator';

describe('itsElements', () => {
  describe('over array', () => {
    it('copies elements', () => {
      expect(itsElements([1, 2, 3])).toEqual([1, 2, 3]);
    });
    it('converts elements', () => {
      expect(itsElements([1, 2, 3], el => el + 10)).toEqual([11, 12, 13]);
    });
  });

  describe('over reverse array', () => {
    it('copies elements', () => {
      expect(itsElements(reverseArray([1, 2, 3]))).toEqual([3, 2, 1]);
    });
    it('converts elements', () => {
      expect(itsElements(reverseArray([1, 2, 3]), el => el + 10)).toEqual([13, 12, 11]);
    });
  });

  describe('over raw iterable', () => {
    it('copies elements', () => {
      expect(itsElements(new Set([1, 2, 3]))).toEqual([1, 2, 3]);
    });
    it('converts elements', () => {
      expect(itsElements(new Set([1, 2, 3]), el => el + 10)).toEqual([11, 12, 13]);
    });
  });

  describe('over push iterable', () => {
    it('copies elements', () => {
      expect(itsElements(overMany(1, 2, 3))).toEqual([1, 2, 3]);
    });
    it('converts elements', () => {
      expect(itsElements(overMany(1, 2, 3), el => el + 10)).toEqual([11, 12, 13]);
    });
  });

  describe('over iterable with push iterator', () => {
    let iterable: Iterable<number>;

    beforeEach(() => {
      iterable = {
        [Symbol.iterator]: () => itsIterator(overMany(1, 2, 3)),
      };
    });

    it('copies elements', () => {
      expect(itsElements(iterable)).toEqual([1, 2, 3]);
    });
    it('converts elements', () => {
      expect(itsElements(iterable, el => el + 10)).toEqual([11, 12, 13]);
    });
  });
});
