import { beforeEach, describe, expect, it } from '@jest/globals';
import { iterateIt, iteratorOf } from '../base';
import { itsElements, itsIterator } from '../consumption';
import type { IndexedItemList } from './over-indexed';
import { overIndexed } from './over-indexed';

describe('overIndexed', () => {

  let array: string[];
  let list: IndexedItemList<string>;
  let result: string[];

  beforeEach(() => {
    array = ['foo', 'bar', 'baz'];
    list = {
      get length() {
        return array.length;
      },
      item(index) {
        return array[index];
      },
    };
    result = [];
  });

  it('iterates over list items', () => {
    expect([...overIndexed(list)]).toEqual(array);
  });
  it('pushes list items', () => {
    expect(iterateIt(overIndexed(list), element => {
      result.push(element);
    }).isOver()).toBe(true);
    expect(result).toEqual(array);
  });
  it('resumes iteration', () => {

    const it = itsIterator(overIndexed(list));

    expect(iterateIt(it, () => true).isOver()).toBe(false);
    expect(it.isOver()).toBe(false);

    expect(iterateIt(it, element => {
      result.push(element);
    }).isOver()).toBe(true);
    expect(it.isOver()).toBe(true);
    expect(result).toEqual(array.slice(1));
  });

  describe('over empty list', () => {

    beforeEach(() => {
      list = {
        length: 0,
        item() {
          return null;
        },
      };
    });

    it('does not iterate', () => {

      const it = iteratorOf(overIndexed(list));

      expect(it.isOver()).toBe(false);

      expect([...it]).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
    it('does not push elements', () => {

      const it = iteratorOf(overIndexed(list));

      expect(it.isOver()).toBe(false);

      expect(itsElements(it)).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
  });
});
