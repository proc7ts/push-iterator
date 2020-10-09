import { makePushIterator, pushIterated } from '../base';
import { overMany } from '../construction';
import { itsIterated } from './its-iterated';
import { itsIterator } from './its-iterator';

describe('itsIterator', () => {

  let array: (string | number)[];
  let iterable: Iterable<string | number>;

  beforeEach(() => {
    array = [1, 'foo', 'bar'];
    iterable = new Set(array);
  });

  it('does not alter push iterator', () => {

    const it = itsIterator(iterable);

    expect(itsIterator(it)).toBe(it);
  });
  it('iterates over generator elements', () => {

    function *generate(): IterableIterator<number> {
      yield 1;
      yield 2;
      yield 3;
    }

    const result: number[] = [];

    expect(itsIterated(generate(), element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual([1, 2, 3]);
  });
  it('ignores generator return', () => {

    function *generate(): IterableIterator<number> {
      yield 1;
      yield 2;
      return 3;
    }

    const result: number[] = [];

    expect(itsIterated(generate(), element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual([1, 2]);
  });

  it('pushes all elements', () => {

    const it = itsIterator(iterable);
    const result: typeof array = [];

    expect(pushIterated(it, element => {
      result.push(element);
    })).toBe(false);

    expect(result).toEqual(array);
  });
  it('stops pushing on `false` result', () => {

    const it = itsIterator(iterable);
    const result: typeof array = [];

    expect(pushIterated(it, element => {
      result.push(element);
      return false;
    })).toBe(false);
    expect(it.isOver()).toBe(true);
    expect(result).toEqual(array.slice(0, 1));
  });
  it('resumes pushing', () => {

    const it = itsIterator(iterable);
    const result: typeof array = [];

    expect(pushIterated(it, () => true)).toBe(true);
    expect(it.isOver()).toBe(false);

    expect(pushIterated(it, element => {
      result.push(element);
    })).toBe(false);
    expect(it.isOver()).toBe(true);
    expect(result).toEqual(array.slice(1));
  });
  it('does not push after the end', () => {

    const it = itsIterator(iterable);
    const result: typeof array = [];

    expect(pushIterated(it, () => {/* noop */})).toBe(false);
    expect(it.isOver()).toBe(true);
    expect(pushIterated(it, element => {
      result.push(element);
    })).toBe(false);
    expect(result).toHaveLength(0);
  });

  it('iterates over all elements', () => {
    expect([...itsIterator(iterable)]).toEqual(array);
  });
  it('iterates over the rest of elements', () => {

    const it = itsIterator(iterable);

    expect(pushIterated(it, () => true)).toBe(true);
    expect(it.isOver()).toBe(false);

    expect([...it]).toEqual(array.slice(1));
    expect(it.isOver()).toBe(true);
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

    expect([...it]).toEqual(['test']);
  });

  describe('over raw iterable', () => {
    it('iterates over elements', () => {
      expect([...itsIterator(new Set([1, 2, 3]))]).toEqual([1, 2, 3]);
    });
  });

  describe('over push iterable', () => {
    it('iterates over elements', () => {
      expect([...itsIterator(overMany(1, 2, 3))]).toEqual([1, 2, 3]);
    });
  });

  describe('over array', () => {
    it('iterates over elements', () => {
      expect([...itsIterator([1, 2, 3])]).toEqual([1, 2, 3]);
    });
  });
});
