/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterator } from './push-iterator';
import { PushIterator__symbol } from './push-iterator';
import { PushIterator$next } from './push-iterator.impl';

/**
 * Creates push iterator implementation.
 *
 * @param forNext  A function iterating over elements conforming to {@link PushIterator.forNext} requirement.
 *
 * @returns New push iterator instance performing iteration by `forNext` function.
 */
export function makePushIterator<T>(forNext: PushIterator.Pusher<T>): PushIterator<T> {

  const iterator: PushIterator<T> = {
    [Symbol.iterator]: () => iterator,
    [PushIterator__symbol]: () => iterator,
    next: PushIterator$next,
    forNext,
  };

  return iterator;
}
