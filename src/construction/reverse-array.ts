/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a {@link PushIterable push iterable} over elements of array-like structure in reverse order.
 *
 * @typeParam T  Array elements type.
 * @param array  An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns New push iterable over array elements in reverse order.
 */
export function reverseArray<T>(array: ArrayLike<T>): PushIterable<T> {
  return { [Symbol.iterator]: () => reverseArrayIterator(array) };
}

/**
 * @internal
 */
function reverseArrayIterator<T>(array: ArrayLike<T>): PushIterator<T> {

  let i = array.length - 1;

  return makePushIterator(accept => {

    let done = 0;

    if (i >= 0) {

      do {

        const goOn = accept(array[i--]);

        if (i < 0) {
          done = -1;
        } else if (goOn === false) {
          done = 1;
        }
      } while (!done);
    }

    return done > 0;
  });
}
