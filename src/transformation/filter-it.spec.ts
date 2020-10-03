import { overMany, overNone } from '../construction';
import { itsIterator } from '../its-iterator';
import { makePushIterator } from '../make-push-iterator';
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

    describe('[Symbol.iterator]', () => {
      it('resumes filtering', () => {

        const it = itsIterator(filterIt(new Set([11, 22, 33]), element => element > 11));

        expect(it.forNext(() => false)).toBe(true);

        expect([...it]).toEqual([33]);
        expect([...it]).toHaveLength(0);
      });
    });

    describe('forNext', () => {
      it('resumes filtering', () => {

        const it = itsIterator(filterIt(new Set([11, 22, 33]), element => element > 11));
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
  });

  describe('over push iterable', () => {
    it('filters elements', () => {
      expect([...filterIt(overMany(11, 22, 33), element => element > 11)]).toEqual([22, 33]);
    });
    it('does not filter empty iterable', () => {
      expect([...filterIt(overNone(), () => true)]).toEqual([]);
    });

    describe('forNext', () => {
      it('resumes filtering', () => {

        const it = itsIterator(filterIt(overMany(11, 22, 33), element => element > 11));

        it.forNext(() => false);

        expect([...it]).toEqual([33]);
      });
    });

    describe('[Symbol.iterator]', () => {

      let iterable: PushIterable<number>;

      beforeEach(() => {
        iterable = filterIt(overMany(11, 22, 33), element => element > 11);
      });

      it('iterates over all elements', () => {
        expect(Array.from(iterable)).toEqual([22, 33]);
      });
      it('iterates over the rest of elements', () => {

        const it = itsIterator(iterable);

        it.forNext(() => false);

        expect(Array.from(it)).toEqual([33]);
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
    });
  });
});
