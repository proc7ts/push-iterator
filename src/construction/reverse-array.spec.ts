import { iteratorOf, pushIterated } from '../base';
import { itsElements } from '../consumption';
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

      const it = iteratorOf(reverseArray(array));

      expect([...it]).toEqual(reversed);
      expect([...it]).toHaveLength(0);
    });
    it('resumes iteration', () => {

      const it = iteratorOf(reverseArray(array));

      expect(pushIterated(it, () => true)).toBe(true);
      expect(it.isOver()).toBe(false);

      expect(pushIterated(it, element => {
        result.push(element);
      })).toBe(false);
      expect(it.isOver()).toBe(true);
      expect(result).toEqual(reversed.slice(1));

      expect(pushIterated(it, element => {
        result.push(element);
      })).toBe(false);
      expect(result).toEqual(reversed.slice(1));
      expect([...it]).toHaveLength(0);
    });
  });

  describe('over empty array', () => {
    it('does not iterate', () => {

      const it = iteratorOf(reverseArray([]));

      expect(it.isOver()).toBe(false);

      expect([...it]).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
    it('does not push elements', () => {

      const it = iteratorOf(reverseArray([]));

      expect(it.isOver()).toBe(false);

      expect(itsElements(it)).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
  });
});
