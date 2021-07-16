import { describe, expect, it, jest } from '@jest/globals';
import { iteratorOf } from '../base';
import { overArray, overIndexed, overMany, overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
import { itsSome } from './its-some';

describe('itsSome', () => {
  describe('over array', () => {
    it('returns `false` for empty array', () => {
      expect(itsSome([], () => true)).toBe(false);
    });
    it('returns `false` if all elements mismatch', () => {
      expect(itsSome([1, 2, 3], () => false)).toBe(false);
    });
    it('returns `true` if some element matches', () => {

      const test = jest.fn((element: number) => element > 1);

      expect(itsSome([1, 2, 3], test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
    it('returns `true` if match returned truthy value', () => {

      const test = jest.fn((element: number) => element > 1 ? element as unknown as boolean : false);

      expect(itsSome([1, 2, 3], test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
  });

  describe('over indexed', () => {

    function testIndexed<T>(...elements: T[]): PushIterable<T> {
      return overIndexed({
        length: elements.length,
        item: i => elements[i],
      });
    }

    it('returns `false` for empty iterable', () => {
      expect(itsSome(testIndexed(), () => true)).toBe(false);
    });
    it('returns `false` if all elements mismatch', () => {
      expect(itsSome(testIndexed(1, 2, 3), () => false)).toBe(false);
    });
    it('returns `true` if some element matches', () => {

      const test = jest.fn((element: number) => element > 1);

      expect(itsSome(testIndexed(1, 2, 3), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
    it('returns `true` if match returned truthy value', () => {

      const test = jest.fn((element: number) => element > 1 ? element as unknown as boolean : false);

      expect(itsSome(testIndexed(1, 2, 3), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
  });

  describe('over push iterator of array', () => {
    it('returns `false` if all elements mismatch', () => {
      expect(itsSome(iteratorOf(overArray([1, 2, 3])), () => false)).toBe(false);
    });
    it('returns `true` if some element matches', () => {

      const test = jest.fn((element: number) => element > 1);

      expect(itsSome(iteratorOf(overArray([1, 2, 3])), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
    it('returns `true` if match returned truthy value', () => {

      const test = jest.fn((element: number) => element > 1 ? element as unknown as boolean : false);

      expect(itsSome(iteratorOf(overArray([1, 2, 3])), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
  });

  describe('over raw iterable', () => {
    it('returns `false` for empty iterable', () => {
      expect(itsSome(new Set(), () => true)).toBe(false);
    });
    it('returns `false` if all elements mismatch', () => {
      expect(itsSome(new Set([1, 2, 3]), () => false)).toBe(false);
    });
    it('returns `true` if some element matches', () => {

      const test = jest.fn((element: number) => element > 1);

      expect(itsSome(new Set([1, 2, 3]), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
    it('returns `true` if match returned truthy value', () => {

      const test = jest.fn((element: number) => element > 1 ? element as unknown as boolean : false);

      expect(itsSome(new Set([1, 2, 3]), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
  });

  describe('over push iterable', () => {
    it('returns `false` for empty iterable', () => {
      expect(itsSome(overNone(), () => true)).toBe(false);
    });
    it('returns `false` if all elements mismatch', () => {
      expect(itsSome(overMany(1, 2, 3), () => false)).toBe(false);
    });
    it('returns `true` if some element matches', () => {

      const test = jest.fn((element: number) => element > 1);

      expect(itsSome(overMany(1, 2, 3), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
    it('returns `true` if match returned truthy value', () => {

      const test = jest.fn((element: number) => element > 1 ? element as unknown as boolean : false);

      expect(itsSome(overMany(1, 2, 3), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
  });

  describe('over push iterator', () => {
    it('returns `false` if all elements mismatch', () => {
      expect(itsSome(iteratorOf(overMany(1, 2, 3)), () => false)).toBe(false);
    });
    it('returns `true` if some element matches', () => {

      const test = jest.fn((element: number) => element > 1);

      expect(itsSome(iteratorOf(overMany(1, 2, 3)), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
    it('returns `true` if match returned truthy value', () => {

      const test = jest.fn((element: number) => element > 1 ? element as unknown as boolean : false);

      expect(itsSome(iteratorOf(overMany(1, 2, 3)), test)).toBe(true);
      expect(test).toHaveBeenCalledWith(1);
      expect(test).toHaveBeenCalledWith(2);
      expect(test).not.toHaveBeenCalledWith(3);
    });
  });
});
