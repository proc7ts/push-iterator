import { overMany } from '../construction';
import { itsIterated } from './its-iterated';
import { itsIterator } from './its-iterator';

describe('itsIterated', () => {
  describe('over raw iterable', () => {
    it('pushes elements', () => {

      const result: number[] = [];

      itsIterated([1, 2, 3], el => {
        result.push(el);
      });

      expect(result).toEqual([1, 2, 3]);
    });
    it('stops when `false` returned', () => {

      const result: number[] = [];

      itsIterated([1, 2, 3], el => {
        result.push(el);
        return el < 2;
      });

      expect(result).toEqual([1, 2]);
    });
  });

  describe('over push iterable', () => {
    it('pushes elements', () => {

      const result: number[] = [];

      itsIterated(overMany(1, 2, 3), el => {
        result.push(el);
      });

      expect(result).toEqual([1, 2, 3]);
    });
    it('stops when `false` returned', () => {

      const result: number[] = [];

      itsIterated(overMany(1, 2, 3), el => {
        result.push(el);
        return el < 2;
      });

      expect(result).toEqual([1, 2]);
    });
  });

  describe('over iterable with push iterator', () => {

    let iterable: Iterable<number>;

    beforeEach(() => {
      iterable = {
        [Symbol.iterator]: () => itsIterator([1, 2, 3]),
      };
    })

    it('pushes elements', () => {

      const result: number[] = [];

      itsIterated(iterable, el => {
        result.push(el);
      });

      expect(result).toEqual([1, 2, 3]);
    });
    it('stops when `false` returned', () => {

      const result: number[] = [];

      itsIterated(iterable, el => {
        result.push(el);
        return el < 2;
      });

      expect(result).toEqual([1, 2]);
    });
  });
});
