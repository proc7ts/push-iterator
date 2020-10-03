import { overArray } from '../construction';
import { itsSome } from './its-some';

describe('itsSome', () => {
  describe('over raw iterable', () => {
    it('returns `false` for empty iterable', () => {
      expect(itsSome([], () => true)).toBe(false);
    });
    it('returns `false` if all elements mismatch', () => {
      expect(itsSome([1, 2, 3], () => false)).toBe(false);
    });
    it('returns `true` if some element matches', () => {

      const test = jest.fn(element => element > 1);

      expect(itsSome([1, 2, 3], test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
    it('returns `true` if match returned truthy value', () => {

      const test = jest.fn(element => element > 1 ? element as unknown as boolean : false);

      expect(itsSome([1, 2, 3], test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
  });

  describe('over push iterable', () => {
    it('returns `false` for empty iterable', () => {
      expect(itsSome(overArray([]), () => true)).toBe(false);
    });
    it('returns `false` if all elements mismatch', () => {
      expect(itsSome(overArray([1, 2, 3]), () => false)).toBe(false);
    });
    it('returns `true` if some element matches', () => {

      const test = jest.fn(element => element > 1);

      expect(itsSome(overArray([1, 2, 3]), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
    it('returns `true` if match returned truthy value', () => {

      const test = jest.fn(element => element > 1 ? element as unknown as boolean : false);

      expect(itsSome(overArray([1, 2, 3]), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
  });
});
