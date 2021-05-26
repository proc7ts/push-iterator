import { describe, expect, it } from '@jest/globals';
import { iteratorOf, pushIterated } from '../base';
import { PushIterator__symbol } from '../push-iterable';
import { overNone } from './over-none';

describe('overNone', () => {
  it('does not push elements', () => {

    let iterated = false;

    expect(pushIterated(overNone(), () => {
      iterated = true;
    })).toBe(false);
    expect(iterated).toBe(false);
  });
  it('does not iterate', () => {
    expect([...overNone()]).toHaveLength(0);
  });

  describe('iterator', () => {
    it('is itself', () => {
      expect(iteratorOf(overNone())).toBe(overNone());
    });
  });

  describe('push iterator', () => {
    it('is itself', () => {
      expect(overNone()[PushIterator__symbol]()).toBe(overNone());
    });

    describe('isOver', () => {
      it('returns `true`', () => {
        expect(overNone()[PushIterator__symbol]().isOver()).toBe(true);
      });
    });
  });
});
