import { describe, expect, it } from '@jest/globals';
import { iterateIt } from '../base/iterate-it';
import { itsElements, itsIterator } from '../consumption';
import { valueArray } from './value-array';

describe('valueArray', () => {
  it('values elements', () => {
    expect([...valueArray([11, 22, 33], element => element > 11 && element + 100)]).toEqual([122, 133]);
    expect([...valueArray([11, 22, 33], element => element > 11 ? element + 100 : null)]).toEqual([122, 133]);
  });
  it('pushes element values', () => {
    expect(itsElements(valueArray([11, 22, 33], element => element > 11 && element + 100))).toEqual([122, 133]);
    expect(itsElements(valueArray([11, 22, 33], element => element > 11 ? element + 100 : null))).toEqual([122, 133]);
  });

  describe('iterator', () => {
    it('resumes iteration', () => {

      const it = itsIterator(valueArray([11, 22, 33], element => element > 11 && element + 100));

      expect(iterateIt(it, () => true).isOver()).toBe(false);
      expect(it.isOver()).toBe(false);

      expect([...it]).toEqual([133]);
      expect(it.isOver()).toBe(true);

      expect([...it]).toHaveLength(0);
    });
    it('resumes pushing', () => {

      const it = itsIterator(valueArray([11, 22, 33], element => element > 11 && element + 100));
      const result: number[] = [];

      expect(iterateIt(it, () => true).isOver()).toBe(false);
      expect(it.isOver()).toBe(false);

      expect(iterateIt(it, el => {
        result.push(el);
      }).isOver()).toBe(true);
      expect(it.isOver()).toBe(true);
      expect(result).toEqual([133]);

      expect(iterateIt(it, el => {
        result.push(el);
      }).isOver()).toBe(true);
      expect(result).toEqual([133]);
    });
  });
});
