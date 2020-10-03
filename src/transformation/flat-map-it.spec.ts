import { overArray, overMany, overNone } from '../construction';
import { itsEach } from '../consumption';
import { flatMapArray, flatMapIt } from './flat-map-it';

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

  describe('over array', () => {
    it('maps and flattens array elements', () => {

      const it = flatMapIt([11, 22, 33], element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens raw iterable elements', () => {

      const it = flatMapIt([11, 22, 33], element => new Set([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens push iterable elements', () => {

      const it = flatMapIt([11, 22, 33], element => overArray([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('flattens elements', () => {

      const it = flatMapIt<number>([[11, 12], [13, 14]]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
  });

  describe('over empty array', () => {
    it('returns `overNone()`', () => {
      expect(flatMapIt([])).toBe(overNone());
    });
  });

  describe('over one-element array', () => {
    it('maps and flattens element', () => {

      const it = flatMapIt([11], element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12]);
      expect([...it]).toEqual([11, 12]);
    });
  });
});

describe('flatMapArray', () => {
  it('flattens elements', () => {

    const it = flatMapArray([[11, 12], [13, 14]]);
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 13, 14]);
    expect([...it]).toEqual([11, 12, 13, 14]);
  });
});
