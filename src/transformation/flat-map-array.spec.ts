import { overArray, overNone } from '../construction';
import { itsEach } from '../consumption';
import { flatMapArray } from './flat-map-array';

describe('flatMapArray', () => {
  it('maps and flattens array elements', () => {

    const it = flatMapArray([11, 22, 33], element => [element, element + 1]);
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens raw iterable elements', () => {

    const it = flatMapArray([11, 22, 33], element => new Set([element, element + 1]));
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens push iterable elements', () => {

    const it = flatMapArray([11, 22, 33], element => overArray([element, element + 1]));
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('flattens elements', () => {

    const it = flatMapArray<number>([[11, 12], [13, 14]]);
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 13, 14]);
    expect([...it]).toEqual([11, 12, 13, 14]);
  });

  describe('over empty array', () => {
    it('returns `overNone()`', () => {
      expect(flatMapArray([])).toBe(overNone());
    });
  });

  describe('over one-element array', () => {
    it('maps and flattens element', () => {

      const it = flatMapArray([11], element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12]);
      expect([...it]).toEqual([11, 12]);
    });
  });

  describe('without converter', () => {
    it('flattens elements', () => {

      const it = flatMapArray([[11, 12], [13, 14]]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
  });
});
