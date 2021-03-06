import { PushIterable, PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a push iterable implementation.
 *
 * @typeParam T - Iterated elements type.
 * @param iterate - A function iterating over iterable elements conforming to {@link PushIterable.Iterate} requirements.
 *
 * @returns New push iterable instance performing iteration by `forNext` function.
 */
export function makePushIterable<T>(iterate: PushIterable.Iterate<T>): PushIterable<T> {
  return {
    [Symbol.iterator]: PushIterable$iterator,
    [PushIterator__symbol]: iterate,
  };
}

function PushIterable$iterator<T>(this: PushIterable<T>): PushIterator<T> {
  return this[PushIterator__symbol]();
}
