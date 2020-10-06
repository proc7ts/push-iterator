import { pushIterated } from '../base';
import { itsIterator } from '../consumption';
import { overArray } from './over-array';
import { overNone } from './over-none';

describe('overArray', () => {

  let array: string[];
  let result: string[];

  beforeEach(() => {
    array = ['foo', 'bar', 'baz'];
    result = [];
  });

  it('iterates over array elements', () => {
    expect([...overArray(array)]).toEqual(array);
  });
  it('pushes array elements', () => {
    expect(pushIterated(overArray(array), element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(array);
  });
  it('resumes iteration', () => {

    const it = itsIterator(overArray(array));

    expect(pushIterated(it, () => false)).toBe(true);
    expect(pushIterated(it, element => {
      result.push(element);
    })).toBe(false);
    expect(result).toEqual(array.slice(1));
  });

  describe('over empty array', () => {
    it('returns `overNone()`', () => {
      expect(overArray([])).toBe(overNone());
    });
  });

  describe('over one-element array', () => {
    it('iterates over single element', () => {
      expect([...overArray(['one'])]).toEqual(['one']);
    });
  });
});
