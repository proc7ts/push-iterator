import { describe, expect, it } from '@jest/globals';
import { overArray } from '../construction';
import { itsEach } from './its-each';

describe('itsEach', () => {
  describe('over array', () => {
    it('iterates over each element', () => {
      const array = ['foo', 'bar', 'baz'];
      const result: string[] = [];

      itsEach(array, element => {
        result.push(element);

        return false; // To ensure the result is ignored
      });

      expect(result).toEqual(array);
    });
  });

  describe('over raw iterable', () => {
    it('iterates over each element', () => {
      const array = ['foo', 'bar', 'baz'];
      const result: string[] = [];

      itsEach(new Set(array), element => {
        result.push(element);

        return false; // To ensure the result is ignored
      });

      expect(result).toEqual(array);
    });
  });

  describe('over push iterable', () => {
    it('iterates over each element', () => {
      const array = ['foo', 'bar', 'baz'];
      const result: string[] = [];

      itsEach(overArray(array), element => {
        result.push(element);

        return false; // To ensure the result is ignored
      });

      expect(result).toEqual(array);
    });
  });
});
