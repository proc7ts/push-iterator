import { iteratorOf, pushIterated } from '../base';
import { itsElements, itsIterator } from '../consumption';
import { filterArray } from './filter-array';

describe('filterArray', () => {
  it('filters elements', () => {
    expect([...filterArray([11, 22, 33], element => element > 11)]).toEqual([22, 33]);
  });
  it('pushes filtered elements', () => {
    expect(itsElements(filterArray([11, 22, 33], element => element > 11))).toEqual([22, 33]);
  });

  describe('iterator', () => {
    it('resumes filtering', () => {

      const it = itsIterator(filterArray([11, 22, 33], element => element > 11));

      expect(pushIterated(it, () => false)).toBe(true);

      expect([...it]).toEqual([33]);
      expect([...it]).toHaveLength(0);
    });
    it('resumes pushing', () => {

      const it = itsIterator(filterArray([11, 22, 33], element => element > 11));
      const result: number[] = [];

      expect(pushIterated(it, () => false)).toBe(true);
      expect(pushIterated(it, el => {
        result.push(el);
      })).toBe(false);
      expect(result).toEqual([33]);

      expect(pushIterated(it, el => {
        result.push(el);
      })).toBe(false);
      expect(result).toEqual([33]);
    });
  });

  describe('over empty array', () => {
    it('has iterator initially over', () => {
      expect(iteratorOf(filterArray([], () => true)).isOver()).toBe(true);
    });
  });
});
