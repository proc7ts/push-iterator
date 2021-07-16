import { describe, expect, it } from '@jest/globals';
import { iterateIt } from '../base/iterate-it';
import { itsElements, itsIterator } from '../consumption';
import { filterArray } from './filter-array';

describe('filterArray', () => {
  it('filters elements', () => {
    expect([...filterArray([11, 22, 33], element => element > 11)]).toEqual([22, 33]);
  });
  it('pushes filtered elements', () => {
    expect(itsElements(filterArray([11, 22, 33], element => element > 11))).toEqual([22, 33]);
  });
  it('filters out all elements', () => {

    const result: number[] = [];

    expect(iterateIt(
        filterArray([11, 12, 13], () => false),
        el => result.push(el),
    ).isOver()).toBe(true);
    expect(result).toHaveLength(0);
  });

  describe('iterator', () => {
    it('resumes filtering', () => {

      const it = itsIterator(filterArray([11, 22, 33], element => element > 11));

      expect(iterateIt(it, () => true).isOver()).toBe(false);
      expect(it.isOver()).toBe(false);

      expect([...it]).toEqual([33]);
      expect(it.isOver()).toBe(true);

      expect([...it]).toHaveLength(0);
    });
    it('resumes pushing', () => {

      const it = itsIterator(filterArray([11, 22, 33], element => element > 11));
      const result: number[] = [];

      expect(iterateIt(it, () => true).isOver()).toBe(false);
      expect(it.isOver()).toBe(false);

      expect(iterateIt(it, el => {
        result.push(el);
      }).isOver()).toBe(true);
      expect(it.isOver()).toBe(true);
      expect(result).toEqual([33]);

      expect(iterateIt(it, el => {
        result.push(el);
      }).isOver()).toBe(true);
      expect(result).toEqual([33]);
    });
  });
});
