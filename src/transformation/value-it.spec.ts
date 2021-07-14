import { beforeEach, describe, expect, it } from '@jest/globals';
import { iteratorOf, pushIterated } from '../base';
import { overMany, overNone } from '../construction';
import { itsElements } from '../consumption';
import type { PushIterable } from '../push-iterable';
import { valueIt } from './value-it';

describe('valueIt', () => {
  describe('over raw iterable', () => {
    it('values elements', () => {
      expect([...valueIt(new Set([11, 22, 33]), element => element > 11 && element + 100)])
          .toEqual([122, 133]);
      expect([...valueIt(new Set([11, 22, 33]), element => element > 11 ? element + 100 : null)])
          .toEqual([122, 133]);
    });
    it('pushes element values', () => {
      expect(itsElements(valueIt(new Set([11, 22, 33]), element => element > 11 && element + 100)))
          .toEqual([122, 133]);
      expect(itsElements(valueIt(new Set([11, 22, 33]), element => element > 11 ? element + 100 : null)))
          .toEqual([122, 133]);
    });
    it('does not value empty iterable', () => {
      expect([...valueIt(new Set(), () => true)]).toEqual([]);
    });

    describe('iterator', () => {
      it('resumes iteration', () => {

        const it = iteratorOf(valueIt(new Set([11, 22, 33]), element => element > 11 && element + 100));

        expect(pushIterated(it, () => true)).toBe(true);

        expect([...it]).toEqual([133]);
        expect([...it]).toHaveLength(0);
      });
      it('resumes pushing', () => {

        const it = iteratorOf(valueIt(new Set([11, 22, 33]), element => element > 11 && element + 100));
        const result: number[] = [];

        expect(pushIterated(it, () => true)).toBe(true);
        expect(it.isOver()).toBe(false);

        expect(pushIterated(it, el => {
          result.push(el);
        })).toBe(false);
        expect(it.isOver()).toBe(true);
        expect(result).toEqual([133]);

        expect(pushIterated(it, el => {
          result.push(el);
        })).toBe(false);
        expect(result).toEqual([133]);
      });

      describe('isOver', () => {
        it('returns `false` initially', () => {

          const it = iteratorOf(valueIt(new Set<number>(), element => element > 11));

          expect(it.isOver()).toBe(false);
        });
        it('returns `true` when iteration complete', () => {

          const it = iteratorOf(valueIt(new Set<number>(), element => element > 11));

          expect(it.next()).toEqual({ done: true });
          expect(it.isOver()).toBe(true);
        });
        it('returns `true` when last element pushed', () => {

          const it = iteratorOf(valueIt(new Set<number>(), element => element > 11));

          expect(pushIterated(it, () => true)).toBe(false);
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

    it('values elements', () => {
      expect([...valueIt(iterable, element => element > 11 && element + 100)]).toEqual([122, 133]);
      expect([...valueIt(iterable, element => element > 11 ? element + 100 : null)]).toEqual([122, 133]);
    });
    it('pushes element values', () => {
      expect(itsElements(valueIt(iterable, element => element > 11 && element + 100))).toEqual([122, 133]);
      expect(itsElements(valueIt(iterable, element => element > 11 ? element + 100 : null))).toEqual([122, 133]);
    });
  });

  describe('over push iterable', () => {

    let iterable: PushIterable<number>;

    beforeEach(() => {
      iterable = valueIt(overMany(11, 22, 33), element => element > 11 && element + 100);
    });

    it('values elements', () => {
      expect([...iterable]).toEqual([122, 133]);
      expect([...valueIt(overMany(11, 22, 33), element => element > 11 ? element + 100 : null)]).toEqual([122, 133]);
    });
    it('does not value empty iterable', () => {
      expect([...valueIt(overNone(), () => 111)]).toEqual([]);
    });
    it('resumes iteration', () => {

      const it = iteratorOf(iterable);

      pushIterated(it, () => true);
      expect(it.isOver()).toBe(false);

      expect([...it]).toEqual([133]);
      expect(it.isOver()).toBe(true);
    });
    it('iterates over all elements', () => {
      expect(Array.from(iterable)).toEqual([122, 133]);
    });

    describe('iterator', () => {
      it('resumes iteration', () => {

        const it = iteratorOf(iterable);

        pushIterated(it, () => true);
        expect(it.isOver()).toBe(false);

        expect([...it]).toEqual([133]);
        expect(it.isOver()).toBe(true);
      });
      it('aborts iteration', () => {

        const result: number[] = [];
        const it = iteratorOf(iterable);

        expect(pushIterated(it, el => {
          result.push(el);
          return false;
        })).toBe(false);
        expect(it.isOver()).toBe(true);
        expect(result).toEqual([122]);
      });
    });
  });
});
