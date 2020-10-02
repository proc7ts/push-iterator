import { overArray, overMany } from '../construction';
import { itsEach } from '../consumption';
import { flatMapIt } from './flat-map-it';

describe('flatMapIt', () => {
  describe('over raw iterable', () => {
    it('maps and flattens iterable', () => {

      const elements = new Set([11, 22, 33]);
      const it = flatMapIt(elements, element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens iterable elements', () => {

      const elements = new Set([11, 22, 33]);
      const it = flatMapIt(elements, element => new Set([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens push iterable elements', () => {

      const elements = new Set([11, 22, 33]);
      const it = flatMapIt(elements, element => overArray([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
  });

  describe('over push iterable', () => {
    it('maps and flattens iterable', () => {

      const elements = overMany(11, 22, 33);
      const it = flatMapIt(elements, element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens iterable elements', () => {

      const elements = overMany(11, 22, 33);
      const it = flatMapIt(elements, element => new Set([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens push iterable elements', () => {

      const elements = overMany(11, 22, 33);
      const it = flatMapIt(elements, element => overArray([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
  });

  describe('without converter', () => {
    it('flattens raw iterable elements', () => {

      const it = flatMapIt<number>(new Set([[11, 12], [13, 14]]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
    it('flattens push iterable elements', () => {

      const it = flatMapIt<number>(overArray([[11, 12], [13, 14]]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
  });
});
