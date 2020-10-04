/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { arrayIterator } from './array-iterator.impl';
import type { PushOrRawIterable } from './push-iterable';
import { isPushIterable } from './push-iterable';
import type { PushIterator } from './push-iterator';
import { noneIterator, oneValueIterator, rawIteratorOf, toPushIterator } from './push-iterator.impl';

/**
 * Starts iteration over the given `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable or push iterable to iterate over.
 *
 * @return A push iterator iterating over the given iterable.
 */
export function itsIterator<T>(iterable: PushOrRawIterable<T>): PushIterator<T> {
  if (isPushIterable(iterable)) {
    return iterable[Symbol.iterator]();
  }

  if (Array.isArray(iterable)) {

    const length = iterable.length;

    if (length > 1) {
      return arrayIterator<T>(iterable);
    }
    if (!length) {
      return noneIterator;
    }
    return oneValueIterator(iterable[0]);
  }

  return toPushIterator(rawIteratorOf(iterable));
}
