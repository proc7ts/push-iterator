import { overMany } from '../construction';
import { itsElements } from './its-elements';
import { itsIterator } from './its-iterator';

describe('itsElements', () => {
  describe('over raw iterable', () => {
    it('copies elements', () => {
      expect(itsElements([1, 2, 3])).toEqual([1, 2, 3]);
    });
    it('converts elements', () => {
      expect(itsElements([1, 2, 3], el => el + 10)).toEqual([11, 12, 13]);
    });
  });

  describe('over push iterable', () => {
    it('copies elements', () => {
      expect(itsElements(overMany(1, 2, 3))).toEqual([1, 2, 3]);
    });
    it('converts elements', () => {
      expect(itsElements(overMany(1, 2, 3), el => el + 10)).toEqual([11, 12, 13]);
    });
  });

  describe('over iterable with push iterator', () => {

    let iterable: Iterable<number>;

    beforeEach(() => {
      iterable = {
        [Symbol.iterator]: () => itsIterator(overMany(1, 2, 3)),
      };
    });

    it('copies elements', () => {
      expect(itsElements(iterable)).toEqual([1, 2, 3]);
    });
    it('converts elements', () => {
      expect(itsElements(iterable, el => el + 10)).toEqual([11, 12, 13]);
    });
  });
});
