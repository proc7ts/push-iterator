/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterator } from './push-iterator';

/**
 * Checks whether the given iterator implements push iteration protocol.
 *
 * @param iterator  Target iterator to check.
 *
 * @returns `true` if `iterator` has {@link PushIterator.forNext forNext} method, or `false` otherwise.
 */
export function isPushIterator<T>(iterator: Iterator<T> | PushIterator<T>): iterator is PushIterator<T> {
  return !!(iterator as PushIterator<T>).forNext;
}
