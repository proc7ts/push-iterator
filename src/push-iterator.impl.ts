import type { PushIterable } from './push-iterable';
import type { PushIterator } from './push-iterator';

/**
 * @internal
 */
export function PushIterator$iterator<T>(this: T): T {
  return this;
}

/**
 * @internal
 */
export function PushIterator$next<T>(this: PushIterator<T>): IteratorResult<T> {
  for (; ;) {

    let result: IteratorYieldResult<T> | undefined;
    const done = !this.forNext(value => {
      result = { value };
      return false;
    });

    if (result) {
      return result;
    }
    if (done) {
      return { done: true } as IteratorReturnResult<T>;
    }
  }
}

/**
 * @internal
 */
export const noneIterator: PushIterator<never> & PushIterable<never> = {
  [Symbol.iterator]: PushIterator$iterator,
  next: () => ({ done: true } as IteratorReturnResult<unknown>),
  forNext: () => false,
};

/**
 * @internal
 */
export function oneValueIterator<T>(value: T): PushIterator<T> {

  let done = false;

  return {

    [Symbol.iterator]: PushIterator$iterator,

    next() {
      if (done) {
        return { done } as IteratorReturnResult<undefined>;
      }

      done = true;

      return { value };
    },

    forNext(accept) {
      if (!done) {
        done = true;
        accept(value);
      }

      return false;
    },
  };
}

/**
 * @internal
 */
export function toPushIterator<T>(it: Iterator<T>): PushIterator<T> {
  return {

    [Symbol.iterator]: PushIterator$iterator,

    next: () => it.next(),

    forNext(accept) {

      let done = 0;

      do {

        const res = it.next();

        if (res.done) {
          done = -1;
        } else if (accept(res.value) === false) {
          done = 1;
        }
      } while (!done);

      return done > 0;
    },

  };
}
