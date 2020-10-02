import { PushIterable__symbol } from './push-iterable';
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
export function toPushIterator<T>(it: Iterator<T>): PushIterator<T> {
  return {

    [PushIterable__symbol]: 1,

    [Symbol.iterator]: PushIterator$iterator,

    next() {
      return it.next();
    },

    forNext(accept) {
      for (; ;) {

        const res = it.next();

        if (res.done) {
          return false;
        }
        if (accept(res.value) === false) {
          return true;
        }
      }
    },

  };
}
