import { isPushIterable, makePushIterable } from '../base';
import { rawIteratorPusher, toPushIterator } from '../base/push-iterator.raw.impl';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import { overNone } from './over-none';

/**
 * Creates a {@link PushIterable | push iterable} over elements of iterator created by the given function.
 *
 * @typeParam T - Iterated elements type.
 * @param iterate - A function creating new iterator.
 *
 * @returns New push iterable over elements of created iterator.
 */
export function overIterator<T>(iterate: (this: void) => Iterator<T>): PushIterable<T> {
  return makePushIterable(iterateOverRawIterator(iterate));
}

function iterateOverRawIterator<T>(iterate: (this: void) => Iterator<T>): PushIterable.Iterate<T> {
  return accept => {

    const it = iterate();

    if (isPushIterable(it)) {
      return it[PushIterator__symbol](accept);
    }

    const forNext = rawIteratorPusher(it);

    return accept && !forNext(accept) ? overNone() : toPushIterator(it, forNext);
  };
}
