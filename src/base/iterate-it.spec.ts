import { beforeEach, describe, expect, it } from '@jest/globals';
import { overMany } from '../construction';
import { iterateIt } from './iterate-it';
import { iteratorOf } from './iterator-of';

describe('iterateIt', () => {

  let result: number[];

  beforeEach(() => {
    result = [];
  });

  describe.each([
    ['push iterable', () => overMany(1, 22, 333)],
    ['raw iterable', () => new Set([1, 22, 333])],
    [
      'raw iterable with push iterator',
      () => {

        const it = overMany(1, 22, 333);

        return { [Symbol.iterator]: () => iteratorOf(it) };
      },
    ],
    ['array', () => [1, 22, 333]],
  ])('over %s', (_title: string, newIterable: () => Iterable<number>) => {

    let iterable: Iterable<number>;

    beforeEach(() => {
      iterable = newIterable();
    });

    it('iterates over all elements', () => {

      const tail = iterateIt(iterable, el => { result.push(el); });

      expect(result).toEqual([1, 22, 333]);
      expect(tail.isOver()).toBe(true);
    });
    it('iterates over head only', () => {

      const tail = iterateIt(
          iterable,
          el => {
            result.push(el);
            return false;
          },
      );

      expect(result).toEqual([1]);
      expect(tail.isOver()).toBe(true);
    });
    it('iterates over head and returns tail', () => {

      const tail = iterateIt(
          iterable,
          el => {
            result.push(el);
            return true;
          },
      );

      expect(result).toEqual([1]);
      expect(tail.isOver()).toBe(false);

      expect([...tail]).toEqual([22, 333]);
      expect(tail.isOver()).toBe(true);
    });
  });

  describe('over empty array', () => {
    it('does not iterate', () => {

      const tail = iterateIt([], el => { result.push(el); });

      expect(result).toHaveLength(0);
      expect(tail.isOver()).toBe(true);
    });
  });
});
