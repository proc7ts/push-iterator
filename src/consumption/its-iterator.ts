/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { isPushIterable, iteratorOf } from '../base';
import { rawIteratorPusher, toPushIterator } from '../base/raw-iterator.impl';
import type { PushIterator } from '../push-iterator';

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

  return isPushIterable(it) ? it : toPushIterator(it, rawIteratorPusher(it));
}
