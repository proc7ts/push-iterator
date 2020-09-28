import { itsIterator } from './push-iterator';

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
  });
});
