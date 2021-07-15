import { describe, expect, it } from '@jest/globals';
import { iteratorOf } from '../base';
import { iterateIt } from '../base/iterate-it';
import { PushIterator__symbol } from '../push-iterable';
import { overIterable } from './over-iterable';
import { overMany } from './over-many';

describe('overIterable', () => {
  it('iterates over array', () => {
    expect([...overIterable([1, 2, 3])]).toEqual([1, 2, 3]);
  });
  it('iterates over raw iterable', () => {

    function *iterate(): Iterable<number> {
      yield 3;
      yield 2;
      yield 1;
    }

    expect([...overIterable(iterate())]).toEqual([3, 2, 1]);
  });
  it('iterates over raw iterable with push iterator', () => {

    const source = overMany(3, 2, 1);
    const iterable = { [Symbol.iterator]: () => iteratorOf(source) };

    expect([...overIterable(iterable)]).toEqual([3, 2, 1]);
  });
  it('pushes raw iterable elements', () => {

    const it = overIterable(new Set([1, 2, 3]));
    const result: number[] = [];

    iterateIt(it, el => { result.push(el); });

    expect(result).toEqual([1, 2, 3]);
  });

  describe('iterator', () => {
    it('iterates by itself', () => {

      const it = iteratorOf(overIterable(new Set([1, 2, 3])));

      expect(it[PushIterator__symbol]()).toBe(it);
    });

    describe('isOver', () => {
      it('returns `false` initially', () => {

        const it = iteratorOf(overIterable(new Set()));

        expect(it.isOver()).toBe(false);
      });
      it('returns `true` when iteration complete', () => {

        const it = iteratorOf(overIterable(new Set()));

        expect(it.next()).toEqual({ done: true });
        expect(it.isOver()).toBe(true);
      });
      it('returns `true` when last element pushed', () => {

        const it = iteratorOf(overIterable(new Set()));

        expect(iterateIt(it, () => true).isOver()).toBe(true);
        expect(it.isOver()).toBe(true);
      });
    });
  });
});
