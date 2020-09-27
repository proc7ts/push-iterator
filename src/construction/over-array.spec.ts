import { itsIterator } from '../push-iterator';
import { overArray } from './over-array';

describe('overArray', () => {

  let array: string[];
  let result: string[];

  beforeEach(() => {
    array = ['foo', 'bar', 'baz'];
    result = [];
  });

  it('iterates over array elements', () => {
    expect(itsIterator(overArray(array)).forNext(element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(array);
  });
  it('does not iterate over empty array', () => {
    expect(itsIterator(overArray([])).forNext(element => {
      result.push(element);
    })).toBe(false);
    expect(result).toHaveLength(0);
  });
  it('resumes iteration', () => {

    const it = itsIterator(overArray(array));

    expect(it.forNext(() => false)).toBe(true);
    expect(it.forNext(element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(array.slice(1));
  });
});
