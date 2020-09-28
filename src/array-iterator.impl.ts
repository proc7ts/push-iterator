import type { PushIterator } from './push-iterator';
import { pushIteratorBy } from './push-iterator.impl';

/**
 * @internal
 */
export function arrayIterator<T>(array: ArrayLike<T>): PushIterator<T> {

  let i = 0;

  return pushIteratorBy(accept => {
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
  });
}
