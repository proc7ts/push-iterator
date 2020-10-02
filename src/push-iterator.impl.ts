import type { PushIterator, PushOrRawIterator } from './push-iterator';
import { PushIterator__symbol } from './push-iterator';

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
export function toPushIterator<T>(it: PushOrRawIterator<T>): PushIterator<T> {
  if (it.forNext) {
    return it;
  }

  const iterator: PushIterator<T> = {

    [Symbol.iterator]: () => iterator,

    [PushIterator__symbol]: () => iterator,

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

  return iterator;
}
