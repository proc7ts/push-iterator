/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { arrayIterator } from './array-iterator.impl';
import type { PushIterable } from './push-iterable';
import type { PushIterator } from './push-iterator';
import { toPushIterator } from './push-iterator.impl';

/**
 * Starts iteration over the given `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable or push iterable to iterate over.
 *
 * @return A push iterator iterating over the given iterable.
 */
export function itsIterator<T>(iterable: Iterable<T> | PushIterable<T>): PushIterator<T> {
    if (Array.isArray(iterable)) {
        return arrayIterator(iterable);
    }
    return toPushIterator(iterable[Symbol.iterator]());
}
