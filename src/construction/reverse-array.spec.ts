import { itsIterator, pushIterated } from '../base';
import { reverseArray } from './reverse-array';

describe('reverseArray', () => {

  let array: string[];
  let reversed: string[];
  let result: string[];

  beforeEach(() => {
    array = ['foo', 'bar', 'baz'];
    reversed = Array.from(array).reverse();
    result = [];
  });

  it('iterates over array elements', () => {
    expect(pushIterated(reverseArray(array), element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(reversed);
  });
  it('does not iterate over empty array', () => {
    expect(pushIterated(reverseArray([]), element => {
      result.push(element);
    })).toBe(false);
    expect(result).toHaveLength(0);
  });
  it('resumes iteration', () => {

    const it = itsIterator(reverseArray(array));

    expect(pushIterated(it, () => false)).toBe(true);
    expect(pushIterated(it, element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(reversed.slice(1));
  });
});
