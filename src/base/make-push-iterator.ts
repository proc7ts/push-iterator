/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterator$iterate, PushIterator$iterator, PushIterator$next } from '../impl';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates push iterator implementation.
 *
 * @param forNext  A function iterating over elements conforming to {@link PushIterator.forNext} requirement.
 *
 * @returns New push iterator instance performing iteration by `forNext` function.
 */
export function makePushIterator<T>(forNext: PushIterator.Pusher<T>): PushIterator<T> {
  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol]: PushIterator$iterate,
    next: PushIterator$next,
    forNext,
  };
}
