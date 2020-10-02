import { PushIterator__symbol } from '../push-iterator';
import { overIterable } from './over-iterable';

describe('overIterable', () => {
  it('iterates over array', () => {
    expect([...overIterable([1, 2, 3])]).toEqual([1, 2, 3]);
  });
  it('iterates over raw iterable', () => {

    function *iterate(): Iterable<number> {
      yield 3;
      yield 2;
      yield 1;
    }

    expect([...overIterable(iterate())]).toEqual([3, 2, 1]);
  });

  describe('[Symbol.iterator]', () => {
    describe('[PushIterator__symbol]', () => {
      it('returns iterator itself', () => {

        const it = overIterable(new Set([1, 2, 3]))[Symbol.iterator]();

        expect(it[PushIterator__symbol]()).toBe(it);
      });
    });
  });
});
