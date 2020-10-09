import { overMany } from '../construction';
import { itsHead } from './its-head';

describe('itsHead', () => {

  let result: number[];

  beforeEach(() => {
    result = [];
  });

  describe.each([
    ['push iterable', () => overMany(1, 22, 333)],
    ['raw iterable', () => new Set([1, 22, 333])],
    ['array', () => [1, 22, 333]],
  ])('over %s', (_title: string, newIterable: () => Iterable<number>) => {

    let iterable: Iterable<number>;

    beforeEach(() => {
      iterable = newIterable();
    });

    it('iterates over all elements', () => {

      const tail = itsHead(iterable, el => { result.push(el); });

      expect(result).toEqual([1, 22, 333]);
      expect(tail.isOver()).toBe(true);
    });
    it('iterates over head only', () => {

      const tail = itsHead(
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

      const tail = itsHead(
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

      const tail = itsHead([], el => { result.push(el); });

      expect(result).toHaveLength(0);
      expect(tail.isOver()).toBe(true);
    });
  });
});
