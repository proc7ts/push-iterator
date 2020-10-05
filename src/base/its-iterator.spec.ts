import { overMany } from '../construction';
import { itsIterator } from './its-iterator';
import { makePushIterator } from './make-push-iterator';

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

    expect(itsIterator(generate()).forNext(element => {
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

    expect(itsIterator(generate()).forNext(element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual([1, 2]);
  });

  describe('forNext', () => {
    it('iterates over all elements', () => {

      const it = itsIterator(iterable);
      const result: typeof array = [];

      expect(it.forNext(element => {
        result.push(element);
      })).toBe(false);

      expect(result).toEqual(array);
    });
    it('stops iteration on `false` result', () => {

      const it = itsIterator(iterable);
      const result: typeof array = [];

      expect(it.forNext(element => {
        result.push(element);
        return false;
      })).toBe(true);

      expect(result).toEqual(array.slice(0, 1));
    });
    it('resumes iteration', () => {

      const it = itsIterator(iterable);
      const result: typeof array = [];

      expect(it.forNext(() => false)).toBe(true);
      expect(it.forNext(element => {
        result.push(element);
      })).toBe(false);

      expect(result).toEqual(array.slice(1));
    });
    it('does not iterate after the end', () => {

      const it = itsIterator(iterable);
      const result: typeof array = [];

      expect(it.forNext(() => {/* noop */})).toBe(false);
      expect(it.forNext(element => {
        result.push(element);
      })).toBe(false);
      expect(result).toHaveLength(0);
    });
  });

  describe('[Symbol.iterator]', () => {
    it('iterates over all elements', () => {
      expect(Array.from(itsIterator(iterable))).toEqual(array);
    });
    it('iterates over the rest of elements', () => {

      const it = itsIterator(iterable);

      it.forNext(() => false);

      expect(Array.from(it)).toEqual(array.slice(1));
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
