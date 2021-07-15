import { beforeEach, describe, expect, it } from '@jest/globals';
import { iterateIt } from '../base/iterate-it';
import type { IndexedItemList } from '../construction';
import { itsElements, itsIterator } from '../consumption';
import { filterIndexed } from './filter-indexed';

describe('filterIndexed', () => {

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

  it('filters items', () => {
    expect([...filterIndexed(list, element => element > 11)]).toEqual([22, 33]);
  });
  it('pushes filtered items', () => {
    expect(itsElements(filterIndexed(list, element => element > 11))).toEqual([22, 33]);
  });

  describe('iterator', () => {
    it('resumes filtering', () => {

      const it = itsIterator(filterIndexed(list, element => element > 11));

      expect(iterateIt(it, () => true).isOver()).toBe(false);
      expect(it.isOver()).toBe(false);

      expect([...it]).toEqual([33]);
      expect(it.isOver()).toBe(true);

      expect([...it]).toHaveLength(0);
    });
    it('resumes pushing', () => {

      const it = itsIterator(filterIndexed(list, element => element > 11));
      const result: number[] = [];

      expect(iterateIt(it, () => true).isOver()).toBe(false);
      expect(it.isOver()).toBe(false);

      expect(iterateIt(it, el => {
        result.push(el);
      }).isOver()).toBe(true);
      expect(it.isOver()).toBe(true);
      expect(result).toEqual([33]);

      expect(iterateIt(it, el => {
        result.push(el);
      }).isOver()).toBe(true);
      expect(result).toEqual([33]);
    });
  });
});
