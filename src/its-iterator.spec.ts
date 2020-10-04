import { overMany } from './construction';
import { itsIterator } from './its-iterator';

describe('itsIterator', () => {
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
