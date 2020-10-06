/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterator$iterate, PushIterator$iterator, PushIterator$next } from '../impl';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a push iterator implementation.
 *
 * @param forNext  A function iterating over elements conforming to push iteration protocol.
 *
 * @returns New push iterator instance performing iteration by `forNext` function.
 */
export function makePushIterator<T>(forNext: PushIterator.Pusher<T>): PushIterator<T> {
  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol]: PushIterator$iterate(forNext),
    next: PushIterator$next,
  };
}
