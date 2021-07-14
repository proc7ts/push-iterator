import { beforeEach, describe, expect, it } from '@jest/globals';
import { iterateIt } from '../base';
import { IndexedItemList, overArray } from '../construction';
import { itsEach, itsElements } from '../consumption';
import { flatMapIndexed } from './flat-map-indexed';

describe('flatMapIndexed', () => {

  let list: IndexedItemList<number>;

  beforeEach(() => {

    const array = [11, 22, 33];

    list = {
      length: array.length,
      item(index) {
        return array[index];
      },
    };
  });

  it('maps and flattens array elements', () => {

    const it = flatMapIndexed(list, element => [element, element + 1]);
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens raw iterable elements', () => {

    const it = flatMapIndexed(list, element => new Set([element, element + 1]));
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens push iterable elements', () => {

    const it = flatMapIndexed(list, element => overArray([element, element + 1]));
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });

  describe('iterator', () => {
    it('resumes processing', () => {

      const result: number[] = [];
      const it = iterateIt(
          flatMapIndexed(list, element => overArray([element, element + 1])),
          element => {
            result.push(element);
            if (result.length > 2) {
              return true;
            }
            return;
          },
      );

      expect(it.isOver()).toBe(false);
      expect(result).toEqual([11, 12, 22]);

      expect([...it]).toEqual([23, 33, 34]);
      expect(it.isOver()).toBe(true);
      expect([...it]).toHaveLength(0);
    });
    it('aborts processing', () => {

      const result: number[] = [];
      const it = iterateIt(
          flatMapIndexed(list, element => overArray([element, element + 1])),
          element => {
            result.push(element);
            if (result.length > 2) {
              return false;
            }
            return;
          },
      );

      expect(it.isOver()).toBe(true);
      expect([...it]).toHaveLength(0);
      expect(result).toEqual([11, 12, 22]);
    });
  });

  describe('over empty list', () => {
    it('does not iterate', () => {
      expect(itsElements(flatMapIndexed({
        length: 0,
        item: () => null,
      }))).toHaveLength(0);
    });
  });

  describe('without converter', () => {
    it('flattens items', () => {

      const array = [[11, 12], [13, 14]];
      const list = {
        length: array.length,
        item(index: number) {
          return array[index];
        },
      };

      const it = flatMapIndexed(list);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
  });
});
