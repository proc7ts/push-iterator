/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { arrayIterator } from '../array-iterator.impl';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable push iterable} over elements of array-like structure.
 *
 * @typeParam T  Array elements type.
 * @param array  An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns New push iterable over array elements.
 */
export function overArray<T>(array: ArrayLike<T>): PushIterable<T> {
  return { [Symbol.iterator]: () => arrayIterator(array) };
}
