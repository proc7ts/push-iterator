/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushOrRawIterator } from '../push-iterator';

/**
 * Constructs iterator over elements of the given `iterable`.
 *
 * Calls `iterable[Symbol.iterator]()` and returns its result.
 *
 * @param iterable  An iterable to construct iterator of.
 *
 * @returns Either push or raw iterable.
 */
export function iteratorOf<T>(iterable: Iterable<T>): PushOrRawIterator<T> {
  return iterable[Symbol.iterator]();
}
