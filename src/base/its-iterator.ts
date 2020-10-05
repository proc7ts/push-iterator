/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { toPushIterator } from '../impl';
import type { PushIterator } from '../push-iterator';
import { iteratorOf } from './iterator-of';

/**
 * Starts iteration over the given `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable or push iterable to iterate over.
 *
 * @return A push iterator iterating over the given iterable.
 */
export function itsIterator<T>(iterable: Iterable<T>): PushIterator<T> {

  const it = iteratorOf(iterable);

  return it.forNext ? it : toPushIterator(it);
}
