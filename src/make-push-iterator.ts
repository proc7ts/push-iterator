/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterable__symbol } from './push-iterable';
import type { PushIterator } from './push-iterator';
import { PushIterator$iterator, PushIterator$next } from './push-iterator.impl';

/**
 * Creates push iterator implementation.
 *
 * @param forNext  A function iterating over elements conforming to {@link PushIterator.forNext} requirement.
 *
 * @returns New push iterator instance performing iteration by `forNext` function.
 */
export function makePushIterator<T>(forNext: PushIterator.Pusher<T>): PushIterator<T> {
  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]: PushIterator$iterator,
    next: PushIterator$next,
    forNext,
  };
}
