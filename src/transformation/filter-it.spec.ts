import { overMany, overNone } from '../construction';
import { itsIterator } from '../its-iterator';
import { filterIt } from './filter-it';

describe('filterIt', () => {
  describe('over raw iterable', () => {
    it('filters elements', () => {
      expect([...filterIt(new Set([11, 22, 33]), element => element > 11)]).toEqual([22, 33]);
    });
    it('resumes filtering', () => {

      const it = itsIterator(filterIt(new Set([11, 22, 33]), element => element > 11));

      it.forNext(() => false);

      expect([...it]).toEqual([33]);
    });
    it('does not filter empty iterable', () => {
      expect([...filterIt([], () => true)]).toEqual([]);
    });
  });

  describe('over push iterable', () => {
    it('filters elements', () => {
      expect([...filterIt(overMany(11, 22, 33), element => element > 11)]).toEqual([22, 33]);
    });
    it('resumes filtering', () => {

      const it = itsIterator(filterIt(overMany(11, 22, 33), element => element > 11));

      it.forNext(() => false);

      expect([...it]).toEqual([33]);
    });
    it('does not filter empty iterable', () => {
      expect([...filterIt(overNone(), () => true)]).toEqual([]);
    });
  });
});
