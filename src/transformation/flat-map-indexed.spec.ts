import { beforeEach, describe, expect, it } from '@jest/globals';
import { iterateIt } from '../base/iterate-it';
import { IndexedItemList, overArray, overMany } from '../construction';
import { itsEach, itsElements } from '../consumption';
import { PushIterationMode } from '../push-iteration-mode';
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
  it('allows to select flattened elements', () => {

    const it = flatMapIndexed(list, element => overMany(element, element + 1));
    const result: number[] = [];

    iterateIt(
        it,
        el => {
          result.push(el);
          return result.length > 2 ? false : void 0;
        },
        PushIterationMode.Only,
    );

    expect(result).toEqual([11, 12, 22]);
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
