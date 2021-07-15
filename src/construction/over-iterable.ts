import type { PushIterable } from '../push-iterable';
import { overArray } from './over-array';
import { overIterator } from './over-iterator';

/**
 * Creates a {@link PushIterable | push iterable} over elements of the given raw iterable.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable to iterate over elements of.
 *
 * @returns New push iterable over elements of the given `iterable`.
 */
export function overIterable<T>(iterable: Iterable<T>): PushIterable<T> {
  return Array.isArray(iterable)
      ? overArray<T>(iterable)
      : overIterator(() => iterable[Symbol.iterator]());
}
