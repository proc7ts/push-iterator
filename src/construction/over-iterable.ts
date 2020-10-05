/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { toPushIterator } from '../impl';
import type { PushIterable } from '../push-iterable';
import { overArray } from './over-array';

/**
 * Creates a {@link PushIterable push iterable} over elements of the given raw iterable.
 *
 * @typeParam T  Iterated elements type.
 * @param source  Source iterable to iterate over elements of.
 *
 * @returns New push iterable over elements of the given `source`.
 */
export function overIterable<T>(source: Iterable<T>): PushIterable<T> {
  return Array.isArray(source)
      ? overArray<T>(source)
      : { [Symbol.iterator]: () => toPushIterator(source[Symbol.iterator]()) };
}
