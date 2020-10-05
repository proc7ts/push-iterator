/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { arrayIterator } from '../impl';
import type { PushIterable } from '../push-iterable';
import { overNone } from './over-none';
import { overOne } from './over-one';

/**
 * Creates a {@link PushIterable push iterable} over elements of array-like structure.
 *
 * @typeParam T  Array elements type.
 * @param array  An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns New push iterable over array elements.
 */
export function overArray<T>(array: ArrayLike<T>): PushIterable<T> {
  return array.length > 1
      ? { [Symbol.iterator]: () => arrayIterator(array) }
      : (!array.length
          ? overNone()
          : overOne(array[0]));
}
