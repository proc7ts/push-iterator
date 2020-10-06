/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterable$iterator } from '../impl';
import { PushIterable, PushIterator__symbol } from '../push-iterable';

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
