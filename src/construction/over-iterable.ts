/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf, makePushIterable } from '../base';
import { rawIteratorPusher, toPushIterator } from '../impl';
import type { PushIterable } from '../push-iterable';
import { overArray } from './over-array';

/**
 * Creates a {@link PushIterable push iterable} over elements of the given raw iterable.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to iterate over elements of.
 *
 * @returns New push iterable over elements of the given `iterable`.
 */
export function overIterable<T>(iterable: Iterable<T>): PushIterable<T> {
  return Array.isArray(iterable)
      ? overArray<T>(iterable)
      : makePushIterable(iterateOverRawIterable(iterable));
}

/**
 * @internal
 */
function iterateOverRawIterable<T>(iterable: Iterable<T>): PushIterable.RawIterate<T> {
  return accept => {

    const it = iteratorOf(iterable);
    const forNext = rawIteratorPusher(it);

    return accept ? forNext(accept) : toPushIterator(it, forNext);
  };
}
