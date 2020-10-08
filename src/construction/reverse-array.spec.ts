import { iteratorOf, pushIterated } from '../base';
import { itsIterator } from '../consumption';
import { reverseArray } from './reverse-array';

describe('reverseArray', () => {

  let array: string[];
  let reversed: string[];
  let result: string[];

  beforeEach(() => {
    array = ['foo', 'bar', 'baz'];
    reversed = array.slice().reverse();
    result = [];
  });

  it('iterates over array elements', () => {
    expect(pushIterated(reverseArray(array), element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(reversed);
  });
  it('pushes array elements', () => {
    expect(pushIterated(reverseArray(array), element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(reversed);
  });

  describe('iterator', () => {
    it('iterates over elements', () => {

      const it = itsIterator(reverseArray(array));

      expect([...it]).toEqual(reversed);
      expect([...it]).toHaveLength(0);
    });
    it('resumes iteration', () => {

      const it = itsIterator(reverseArray(array));

      expect(pushIterated(it, () => false)).toBe(true);
      expect(pushIterated(it, element => {
        result.push(element);
      })).toBe(false);
      expect(result).toEqual(reversed.slice(1));

      expect(pushIterated(it, element => {
        result.push(element);
      })).toBe(false);
      expect(result).toEqual(reversed.slice(1));
      expect([...it]).toHaveLength(0);
    });
  });

  describe('over empty array', () => {
    it('has iterator initially over', () => {
      expect(iteratorOf(reverseArray([])).isOver()).toBe(true);
    });
  });
});
