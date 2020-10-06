/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterable, PushIterator__symbol } from '../push-iterable';
import { PushIterable$iterator } from './push-iterable.impl';

/**
 * Creates a push iterable implementation.
 *
 * @param iterate  A function iterating over iterable elements conforming to {@link PushIterable.Iterate} requirements.
 *
 * @returns New push iterable instance performing iteration by `forNext` function.
 */
export function makePushIterable<T>(iterate: PushIterable.Iterate<T>): PushIterable<T> {
  return {
    [Symbol.iterator]: PushIterable$iterator,
    [PushIterator__symbol]: iterate,
  } as PushIterable<T>;
}
