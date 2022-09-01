import { beforeEach, describe, expect, it } from '@jest/globals';
import { iteratorOf, makePushIterator } from '../base';
import { iterateIt } from '../base/iterate-it';
import { overMany, overNone } from '../construction';
import { itsElements } from '../consumption';
import type { PushIterable } from '../push-iterable';
import { valueIt } from './value-it';

describe('valueIt', () => {
  describe('over raw iterable', () => {
    it('values elements', () => {
      expect([...valueIt(new Set([11, 22, 33]), element => element > 11 && element + 100)]).toEqual(
        [122, 133],
      );
      expect([
        ...valueIt(new Set([11, 22, 33]), element => (element > 11 ? element + 100 : null)),
      ]).toEqual([122, 133]);
    });
    it('pushes element values', () => {
      expect(
        itsElements(valueIt(new Set([11, 22, 33]), element => element > 11 && element + 100)),
      ).toEqual([122, 133]);
      expect(
        itsElements(
          valueIt(new Set([11, 22, 33]), element => (element > 11 ? element + 100 : null)),
        ),
      ).toEqual([122, 133]);
    });
    it('does not value empty iterable', () => {
      expect([...valueIt(new Set(), () => true)]).toEqual([]);
    });
    it('filters out all elements', () => {
      const result: number[] = [];

      expect(
        iterateIt(
          valueIt<number>(new Set([11, 12, 13]), () => false),
          el => result.push(el),
        ).isOver(),
      ).toBe(true);
      expect(result).toHaveLength(0);
    });

    describe('iterator', () => {
      it('resumes iteration', () => {
        const it = iteratorOf(
          valueIt(new Set([11, 22, 33]), element => element > 11 && element + 100),
        );

        expect(iterateIt(it, () => true).isOver()).toBe(false);

        expect([...it]).toEqual([133]);
        expect([...it]).toHaveLength(0);
      });
      it('resumes pushing', () => {
        const it = iteratorOf(
          valueIt(new Set([11, 22, 33]), element => element > 11 && element + 100),
        );
        const result: number[] = [];

        expect(iterateIt(it, () => true).isOver()).toBe(false);
        expect(it.isOver()).toBe(false);

        expect(
          iterateIt(it, el => {
            result.push(el);
          }).isOver(),
        ).toBe(true);
        expect(it.isOver()).toBe(true);
        expect(result).toEqual([133]);

        expect(
          iterateIt(it, el => {
            result.push(el);
          }).isOver(),
        ).toBe(true);
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

    it('values elements', () => {
      expect([...valueIt(iterable, element => element > 11 && element + 100)]).toEqual([122, 133]);
      expect([...valueIt(iterable, element => (element > 11 ? element + 100 : null))]).toEqual([
        122, 133,
      ]);
    });
    it('pushes element values', () => {
      expect(itsElements(valueIt(iterable, element => element > 11 && element + 100))).toEqual([
        122, 133,
      ]);
      expect(
        itsElements(valueIt(iterable, element => (element > 11 ? element + 100 : null))),
      ).toEqual([122, 133]);
    });
  });

  describe('over push iterable', () => {
    let iterable: PushIterable<number>;

    beforeEach(() => {
      iterable = valueIt(overMany(11, 22, 33), element => element > 11 && element + 100);
    });

    it('values elements', () => {
      expect([...iterable]).toEqual([122, 133]);
      expect(itsElements(iterable)).toEqual([122, 133]);
      expect([
        ...valueIt(overMany(11, 22, 33), element => (element > 11 ? element + 100 : null)),
      ]).toEqual([122, 133]);
    });
    it('does not value empty iterable', () => {
      expect([...valueIt(overNone(), () => 111)]).toEqual([]);
    });
    it('resumes iteration', () => {
      const it = iteratorOf(iterable);

      iterateIt(it, () => true);
      expect(it.isOver()).toBe(false);

      expect([...it]).toEqual([133]);
      expect(it.isOver()).toBe(true);
    });
    it('iterates over all elements', () => {
      expect(Array.from(iterable)).toEqual([122, 133]);
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

      expect([...valueIt(it, element => element)]).toEqual(['test']);
    });

    describe('iterator', () => {
      it('resumes iteration', () => {
        const it = iteratorOf(iterable);

        iterateIt(it, () => true);
        expect(it.isOver()).toBe(false);

        expect([...it]).toEqual([133]);
        expect(it.isOver()).toBe(true);
      });
    });
  });
});
