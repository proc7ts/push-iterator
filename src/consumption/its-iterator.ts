import { isPushIterable } from '../base';
import { rawIteratorPusher, toPushIterator } from '../base/push-iterator.raw.impl';
import type { PushIterator } from '../push-iterator';

/**
 * Starts iteration over the given `iterable`.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable or push iterable to iterate over.
 *
 * @returns A push iterator iterating over the given iterable.
 */
export function itsIterator<T>(iterable: Iterable<T>): PushIterator<T> {

  const it = iterable[Symbol.iterator]();

  return isPushIterable(it)
      ? it
      : toPushIterator(it, rawIteratorPusher(it));
}
