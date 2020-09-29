import { isPushIterator } from './is-push-iterator';
import type { PushIterator } from './push-iterator';

/**
 * @internal
 */
export function PushIterator$iterator<T>(this: PushIterator<T>): PushIterator<T> {
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
  if (isPushIterator(it)) {
    return it;
  }

  return {

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
