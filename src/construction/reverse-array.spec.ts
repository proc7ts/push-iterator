import { itsIterator } from '../push-iterator';
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
    expect(itsIterator(reverseArray(array)).forNext(element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(reversed);
  });
  it('does not iterate over empty array', () => {
    expect(itsIterator(reverseArray([])).forNext(element => {
      result.push(element);
    })).toBe(false);
    expect(result).toHaveLength(0);
  });
  it('resumes iteration', () => {

    const it = itsIterator(reverseArray(array));

    expect(it.forNext(() => false)).toBe(true);
    expect(it.forNext(element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(reversed.slice(1));
  });
});
