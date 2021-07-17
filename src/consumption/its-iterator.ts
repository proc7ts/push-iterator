import { isPushIterable } from '../base';
import { iterator$convert, iterator$pusher } from '../base/iterator.impl';
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
      : iterator$convert(it, iterator$pusher(it));
}
