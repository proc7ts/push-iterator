import { itsEach } from '../consumption';
import { overElementsOf } from './over-elements-of';
import { overMany } from './over-many';
import { overNone } from './over-none';

describe('overElementsOf', () => {

  describe('without sources', () => {
    it('returns `overNone()`', () => {
      expect(overElementsOf()).toBe(overNone());
    });
  });

  describe('with one source', () => {
    it('iterates over single source iterable', () => {
      expect([...overElementsOf([1, 2, 3])]).toEqual([1, 2, 3]);
    });
  });

  describe('with many sources', () => {
    it('iterates over elements of raw iterable sources', () => {

      const it = overElementsOf(new Set([11, 12]), new Set([13, 14]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
    it('iterates over elements of push iterable sources', () => {

      const it = overElementsOf(overMany(11, 12), overMany(13, 14));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
  });
});
