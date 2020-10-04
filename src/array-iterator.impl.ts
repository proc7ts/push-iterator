import type { PushIterator } from './push-iterator';
import { PushIterator$iterator } from './push-iterator.impl';

/**
 * @internal
 */
export const arrayIterator = <T>(array: ArrayLike<T>): PushIterator<T> => {

  let i = 0;

  return {

    [Symbol.iterator]: PushIterator$iterator,

    next: () => i < array.length ? { value: array[i++] } : { done: true } as IteratorReturnResult<undefined>,

    forNext(accept) {

      let done = 0;

      if (i < array.length) {
        do {

          const goOn = accept(array[i++]);

          if (i >= array.length) {
            done = -1;
          } else if (goOn === false) {
            done = 1;
          }
        } while (!done);
      }

      return done > 0;
    },

  };
};
