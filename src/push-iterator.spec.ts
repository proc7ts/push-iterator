import { itsIterator } from './push-iterator';

describe('itsIterator', () => {

  let array: (string | number)[];

  beforeEach(() => {
    array = [1, 'foo', 'bar'];
  });

  it('does not alter push iterator', () => {

    const it = itsIterator(array);

    expect(itsIterator(it)).toBe(it);
  });

  describe('forNext', () => {
    it('iterates over all elements', () => {

      const it = itsIterator(array);
      const result: typeof array = [];

      expect(it.forNext(element => {
        result.push(element);
      })).toBe(false);

      expect(result).toEqual(array);
    });
    it('stops iteration on `false` result', () => {

      const it = itsIterator(array);
      const result: typeof array = [];

      expect(it.forNext(element => {
        result.push(element);
        return false;
      })).toBe(true);

      expect(result).toEqual(array.slice(0, 1));
    });
    it('resumes iteration', () => {

      const it = itsIterator(array);
      const result: typeof array = [];

      expect(it.forNext(() => false)).toBe(true);
      expect(it.forNext(element => {
        result.push(element);
      })).toBe(false);

      expect(result).toEqual(array.slice(1));
    });
    it('does not iterate after the end', () => {

      const it = itsIterator(array);
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
      expect(Array.from(itsIterator(array))).toEqual(array);
    });
    it('iterates over the rest of elements', () => {

      const it = itsIterator(array);

      it.forNext(() => false);

      expect(Array.from(it)).toEqual(array.slice(1));
    });
  });
});
