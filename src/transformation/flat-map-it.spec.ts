import { beforeEach, describe, expect, it } from '@jest/globals';
import { iterateIt, iteratorOf } from '../base';
import { overArray, overMany } from '../construction';
import { itsEach } from '../consumption';
import { flatMapIt } from './flat-map-it';

describe('flatMapIt', () => {
  describe('over raw iterable', () => {
    it('maps and flattens array elements', () => {

      const it = flatMapIt(new Set([11, 22, 33]), element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens raw iterable elements', () => {

      const it = flatMapIt(new Set([11, 22, 33]), element => new Set([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens push iterable elements', () => {

      const it = flatMapIt(new Set([11, 22, 33]), element => overArray([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('flattens elements', () => {

      const it = flatMapIt<number>(new Set([[11, 12], [13, 14]]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
  });

  describe('over raw iterator with push iterable', () => {

    let iterable: Iterable<number>;

    beforeEach(() => {

      const src = overMany(11, 22, 33);

      iterable = { [Symbol.iterator]: () => iteratorOf(src) };
    });

    it('maps and flattens array elements', () => {

      const it = flatMapIt(iterable, element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens raw iterable elements', () => {

      const it = flatMapIt(iterable, element => new Set([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
  });

  describe('over push iterable', () => {
    it('maps and flattens array elements', () => {

      const it = flatMapIt(overMany(11, 22, 33), element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens raw iterable elements', () => {

      const it = flatMapIt(overMany(11, 22, 33), element => new Set([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens push iterable elements', () => {

      const it = flatMapIt(overMany(11, 22, 33), element => overArray([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('flattens elements', () => {

      const it = flatMapIt<number>(overArray([[11, 12], [13, 14]]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
  });

  describe('iterator', () => {
    it('resumes processing', () => {

      const it = iteratorOf(flatMapIt<number>(overArray([[11, 12], [13, 14]])));
      const result: number[] = [];

      iterateIt(it, el => {
        result.push(el);
        if (result.length > 2) {
          return true;
        }
        return;
      });

      expect(result).toEqual([11, 12, 13]);
      expect(it.isOver()).toBe(false);

      expect([...it]).toEqual([14]);
      expect(it.isOver()).toBe(true);
      expect([...it]).toHaveLength(0);
    });
    it('aborts processing', () => {

      const it = iteratorOf(flatMapIt<number>(overArray([[11, 12], [13, 14]])));
      const result: number[] = [];

      iterateIt(it, el => {
        result.push(el);
        if (result.length > 2) {
          return false;
        }
        return;
      });

      expect(result).toEqual([11, 12, 13]);
      expect(it.isOver()).toBe(true);
      expect([...it]).toHaveLength(0);
    });
  });
});
