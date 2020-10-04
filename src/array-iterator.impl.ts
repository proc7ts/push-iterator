import { PushIterable__symbol } from './push-iterable';
import type { PushIterator } from './push-iterator';
import { PushIterator$iterator } from './push-iterator.impl';

/**
 * @internal
 */
export function arrayIterator<T>(array: ArrayLike<T>): PushIterator<T> {

  let i = 0;

  return {

    [PushIterable__symbol]: 1,

    [Symbol.iterator]: PushIterator$iterator,

    next: () => i < array.length ? { value: array[i++] } : { done: true } as IteratorReturnResult<undefined>,

    forNext(accept) {
      if (i >= array.length) {
        return false;
      }

      let done = 0;

      do {

        const goOn = accept(array[i++]);

        if (i >= array.length) {
          done = -1;
        } else if (goOn === false) {
          done = 1;
        }
      } while (!done);

      return done > 0;
    },

  };
}
