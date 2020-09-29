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
});
