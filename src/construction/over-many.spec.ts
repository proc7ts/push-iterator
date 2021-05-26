import { describe, expect, it } from '@jest/globals';
import { overMany } from './over-many';
import { overNone } from './over-none';

describe('overMany', () => {
  describe('without values', () => {
    it('returns `overNone()', () => {
      expect(overMany()).toBe(overNone());
    });
  });
  describe('with one value', () => {
    it('iterates over one value', () => {
      expect([...overMany('one')]).toEqual(['one']);
    });
  });
  describe('with many values', () => {
    it('iterates over many values', () => {
      expect([...overMany('one', 'two', 'three')]).toEqual(['one', 'two', 'three']);
    });
  });
});
