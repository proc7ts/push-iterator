import { isPushIterable, makePushIterable } from '../base';
import { iterator$convert, iterator$pusher } from '../base/iterator.impl';
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
  return makePushIterable(overIterator$iterate(iterate));
}

function overIterator$iterate<T>(iterate: (this: void) => Iterator<T>): PushIterable.Iterate<T> {
  return accept => {

    const it = iterate();

    if (isPushIterable(it)) {
      return it[PushIterator__symbol](accept);
    }

    const forNext = iterator$pusher(it);

    return accept && !forNext(accept) ? overNone() : iterator$convert(it, forNext);
  };
}
