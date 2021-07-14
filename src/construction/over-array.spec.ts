import { beforeEach, describe, expect, it } from '@jest/globals';
import { iterateIt, iteratorOf } from '../base';
import { itsElements, itsIterator } from '../consumption';
import { overArray } from './over-array';

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
    expect(iterateIt(overArray(array), element => {
      result.push(element);
    }).isOver()).toBe(true);
    expect(result).toEqual(array);
  });
  it('resumes iteration', () => {

    const it = itsIterator(overArray(array));

    expect(iterateIt(it, () => true).isOver()).toBe(false);
    expect(it.isOver()).toBe(false);

    expect(iterateIt(it, element => {
      result.push(element);
    }).isOver()).toBe(true);
    expect(it.isOver()).toBe(true);
    expect(result).toEqual(array.slice(1));
  });

  describe('over empty array', () => {
    it('does not iterate', () => {

      const it = iteratorOf(overArray([]));

      expect(it.isOver()).toBe(false);

      expect([...it]).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
    it('does not push elements', () => {

      const it = iteratorOf(overArray([]));

      expect(it.isOver()).toBe(false);

      expect(itsElements(it)).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
  });
});
