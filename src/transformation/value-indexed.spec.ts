import { pushIterated } from '../base';
import type { IndexedItemList } from '../construction';
import { itsElements, itsIterator } from '../consumption';
import { valueIndexed } from './value-indexed';

describe('valueIndexed', () => {

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

  it('values items', () => {
    expect([...valueIndexed(list, element => element > 11 && element + 100)]).toEqual([122, 133]);
    expect([...valueIndexed(list, element => element > 11 ? element + 100 : null)]).toEqual([122, 133]);
  });
  it('pushes item values', () => {
    expect(itsElements(valueIndexed(list, element => element > 11 && element + 100))).toEqual([122, 133]);
    expect(itsElements(valueIndexed(list, element => element > 11 ? element + 100 : null))).toEqual([122, 133]);
  });

  describe('iterator', () => {
    it('resumes iteration', () => {

      const it = itsIterator(valueIndexed(list, element => element > 11 && element + 100));

      expect(pushIterated(it, () => true)).toBe(true);
      expect(it.isOver()).toBe(false);

      expect([...it]).toEqual([133]);
      expect(it.isOver()).toBe(true);

      expect([...it]).toHaveLength(0);
    });
    it('resumes pushing', () => {

      const it = itsIterator(valueIndexed(list, element => element > 11 && element + 100));
      const result: number[] = [];

      expect(pushIterated(it, () => true)).toBe(true);
      expect(it.isOver()).toBe(false);

      expect(pushIterated(it, el => {
        result.push(el);
      })).toBe(false);
      expect(it.isOver()).toBe(true);
      expect(result).toEqual([133]);

      expect(pushIterated(it, el => {
        result.push(el);
      })).toBe(false);
      expect(result).toEqual([133]);
    });
  });
});
