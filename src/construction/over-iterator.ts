import { makePushIterable } from '../base';
import { iterateRaw } from '../base/iterate-raw.impl';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable | push iterable} over elements of iterator created by the given function.
 *
 * @typeParam T - Iterated elements type.
 * @param iterate - A function creating new iterator.
 *
 * @returns New push iterable over elements of created iterator.
 */
export function overIterator<T>(iterate: (this: void) => Iterator<T>): PushIterable<T> {
  return makePushIterable(accept => iterateRaw(iterate, accept));
}
