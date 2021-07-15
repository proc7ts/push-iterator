import { beforeEach, describe, expect, it } from '@jest/globals';
import { iteratorOf, makePushIterator } from '../base';
import { iterateIt } from '../base/iterate-it';
import { overMany, overNone } from '../construction';
import { itsElements } from '../consumption';
import type { PushIterable } from '../push-iterable';
import { filterIt } from './filter-it';

describe('filterIt', () => {
  describe('over raw iterable', () => {
    it('filters elements', () => {
      expect([...filterIt(new Set([11, 22, 33]), element => element > 11)]).toEqual([22, 33]);
    });
    it('pushes filtered elements', () => {
      expect(itsElements(filterIt(new Set([11, 22, 33]), element => element > 11))).toEqual([22, 33]);
    });
    it('does not filter empty iterable', () => {
      expect([...filterIt(new Set(), () => true)]).toEqual([]);
    });

    describe('iterator', () => {
      it('resumes filtering', () => {

        const it = iteratorOf(filterIt(new Set([11, 22, 33]), element => element > 11));

        expect(iterateIt(it, () => true).isOver()).toBe(false);

        expect([...it]).toEqual([33]);
        expect([...it]).toHaveLength(0);
      });
      it('resumes pushing', () => {

        const it = iteratorOf(filterIt(new Set([11, 22, 33]), element => element > 11));
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

      describe('isOver', () => {
        it('returns `false` initially', () => {

          const it = iteratorOf(filterIt(new Set<number>(), element => element > 11));

          expect(it.isOver()).toBe(false);
        });
        it('returns `true` when iteration complete', () => {

          const it = iteratorOf(filterIt(new Set<number>(), element => element > 11));

          expect(it.next()).toEqual({ done: true });
          expect(it.isOver()).toBe(true);
        });
        it('returns `true` when last element pushed', () => {

          const it = iteratorOf(filterIt(new Set<number>(), element => element > 11));

          expect(iterateIt(it, () => true).isOver()).toBe(true);
          expect(it.isOver()).toBe(true);
        });
      });
    });
  });

  describe('over raw iterable with push iterator', () => {

    let iterable: Iterable<number>;

    beforeEach(() => {

      const src = overMany(11, 22, 33);

      iterable = { [Symbol.iterator]: () => iteratorOf(src) };
    });

    it('filters elements', () => {
      expect([...filterIt(iterable, element => element > 11)]).toEqual([22, 33]);
    });
    it('pushes filtered elements', () => {
      expect(itsElements(filterIt(iterable, element => element > 11))).toEqual([22, 33]);
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

      const it = iteratorOf(filterIt(overMany(11, 22, 33), element => element > 11));

      iterateIt(it, () => true);
      expect(it.isOver()).toBe(false);

      expect([...it]).toEqual([33]);
      expect(it.isOver()).toBe(true);
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

        const it = iteratorOf(iterable);

        iterateIt(it, () => true);
        expect(it.isOver()).toBe(false);

        expect([...it]).toEqual([33]);
        expect(it.isOver()).toBe(true);
      });
    });
  });
});
