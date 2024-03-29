import { describe, expect, it } from '@jest/globals';
import { iteratorOf } from '../base';
import { iterateIt } from '../base/iterate-it';
import { itsElements } from '../consumption';
import { PushIterator__symbol } from '../push-iterable';
import { overOne } from './over-one';

describe('overOne', () => {
  it('pushes single element', () => {
    const result: string[] = [];
    const it = overOne('one')[Symbol.iterator]();

    expect(
      iterateIt(it, element => {
        result.push(element);
      }).isOver(),
    ).toBe(true);
    expect([...it]).toHaveLength(0);
    expect(
      iterateIt(it, element => {
        result.push(element);
      }).isOver(),
    ).toBe(true);

    expect(result).toEqual(['one']);
  });
  it('iterates over single value', () => {
    expect([...overOne('one')]).toEqual(['one']);
  });

  describe('iterator', () => {
    it('iterates over itself', () => {
      const it = iteratorOf(overOne('one'))[PushIterator__symbol]();

      expect(iteratorOf(it)).toBe(it);
    });

    describe('isOver', () => {
      it('returns `false` initially', () => {
        const it = iteratorOf(overOne('one'));

        expect(it.isOver()).toBe(false);
      });
      it('returns `true` when one element iterated', () => {
        const it = iteratorOf(overOne('one'));

        expect(it.next()).toEqual({ value: 'one' });
        expect(it.isOver()).toBe(true);
      });
      it('returns `true` when one element pushed', () => {
        const it = iteratorOf(overOne('one'));

        expect(itsElements(it)).toEqual(['one']);
        expect(it.isOver()).toBe(true);
      });
    });
  });
});
