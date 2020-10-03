import { overNone } from '../construction';
import { itsIterator } from '../its-iterator';
import { filterArray } from './filter-array';

describe('filterArray', () => {
  it('filters elements', () => {
    expect([...filterArray([11, 22, 33], element => element > 11)]).toEqual([22, 33]);
  });

  describe('[Symbol.iterator]', () => {
    it('resumes filtering', () => {

      const it = itsIterator(filterArray([11, 22, 33], element => element > 11));

      expect(it.forNext(() => false)).toBe(true);

      expect([...it]).toEqual([33]);
      expect([...it]).toHaveLength(0);
    });
  });

  describe('forNext', () => {
    it('resumes filtering', () => {

      const it = itsIterator(filterArray([11, 22, 33], element => element > 11));
      const result: number[] = [];

      expect(it.forNext(() => false)).toBe(true);
      expect(it.forNext(el => {
        result.push(el);
      })).toBe(false);
      expect(result).toEqual([33]);

      expect(it.forNext(el => {
        result.push(el);
      })).toBe(false);
      expect(result).toEqual([33]);
    });
  });

  describe('over empty array', () => {
    it('returns `overNone()`', () => {
      expect(filterArray([], () => true)).toBe(overNone());
    });
  });
});
