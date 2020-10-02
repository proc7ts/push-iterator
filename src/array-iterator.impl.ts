import type { PushIterator } from './push-iterator';
import { PushIterator__symbol } from './push-iterator';

/**
 * @internal
 */
export function arrayIterator<T>(array: ArrayLike<T>): PushIterator<T> {

  let i = 0;

  const iterator: PushIterator<T> = {

    [Symbol.iterator]: () => iterator,
    [PushIterator__symbol]: () => iterator,
    next: () => i < array.length ? { value: array[i++] } : { done: true } as IteratorReturnResult<undefined>,
    forNext(accept) {
      if (i >= array.length) {
        return false;
      }

      for (; ;) {

        const goOn = accept(array[i++]);

        if (i >= array.length) {
          return false;
        }
        if (goOn === false) {
          return true;
        }
      }
    },
  };

  return iterator;
}
