/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import { toPushIterator } from '../push-iterator.impl';
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
  if (Array.isArray(source)) {
    return overArray<T>(source);
  }
  return { [Symbol.iterator]: () => toPushIterator(source[Symbol.iterator]()) };
}
