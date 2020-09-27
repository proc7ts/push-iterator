/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import { PushIterator } from '../push-iterator';

/**
 * Builds a {@link PushIterable push iterable} over elements of array-like structure.
 *
 * @typeParam T  Array elements type.
 * @param array  An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns New push iterable over array elements.
 */
export function overArray<T>(array: ArrayLike<T>): PushIterable<T> {
  return { [Symbol.iterator]: () => arrayIterator(array) };
}

/**
 * @internal
 */
function arrayIterator<T>(array: ArrayLike<T>): PushIterator<T> {

  let i = 0;

  return PushIterator.by(accept => {
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
