import { makePushIterator, pushIterated } from '../base';
import { overMany, overNone } from '../construction';
import { itsIterator } from '../consumption';
import type { PushIterable } from '../push-iterable';
import { filterIt } from './filter-it';

describe('filterIt', () => {
  describe('over raw iterable', () => {
    it('filters elements', () => {
      expect([...filterIt(new Set([11, 22, 33]), element => element > 11)]).toEqual([22, 33]);
    });
    it('does not filter empty iterable', () => {
      expect([...filterIt(new Set(), () => true)]).toEqual([]);
    });

    describe('iterator', () => {
      it('resumes filtering', () => {

        const it = itsIterator(filterIt(new Set([11, 22, 33]), element => element > 11));

        expect(pushIterated(it, () => false)).toBe(true);

        expect([...it]).toEqual([33]);
        expect([...it]).toHaveLength(0);
      });
      it('resumes pushing', () => {

        const it = itsIterator(filterIt(new Set([11, 22, 33]), element => element > 11));
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
  });

  describe('over push iterable', () => {

    let iterable: PushIterable<number>;

    beforeEach(() => {
      iterable = filterIt(overMany(11, 22, 33), element => element > 11);
    });

    it('filters elements', () => {
      expect([...filterIt(overMany(11, 22, 33), element => element > 11)]).toEqual([22, 33]);
    });
    it('does not filter empty iterable', () => {
      expect([...filterIt(overNone(), () => true)]).toEqual([]);
    });
    it('resumes filtering', () => {

      const it = itsIterator(filterIt(overMany(11, 22, 33), element => element > 11));

      pushIterated(it, () => false);

      expect([...it]).toEqual([33]);
    });
    it('iterates over all elements', () => {
      expect(Array.from(iterable)).toEqual([22, 33]);
    });
    it('handles non-pushing iterations', () => {

      let i = 0;
      const it = makePushIterator<string>(accept => {
        ++i;
        switch (i) {
        case 1:
        case 2:
        case 4:
          return true;
        case 3:
          accept('test');
          return true;
        default:
          return false;
        }
      });

      expect([...filterIt(it, () => true)]).toEqual(['test']);
    });

    describe('iterator', () => {
      it('resumes filtering', () => {

        const it = itsIterator(iterable);

        pushIterated(it, () => false);

        expect(Array.from(it)).toEqual([33]);
      });
    });
  });
});
