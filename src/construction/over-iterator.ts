import { isPushIterable, makePushIterable } from '../base';
import { iterator$convert, iterator$pusher } from '../base/iterator.impl';
import { PushIterator$empty } from '../base/push-iterator.empty.impl';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';

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
  return (accept, mode = PushIterationMode.Some) => {

    const it = iterate();

    if (isPushIterable(it)) {
      return it[PushIterator__symbol](accept, mode);
    }

    const forNext = iterator$pusher(it);

    return accept && !forNext(accept)
        ? PushIterator$empty
        : iterator$convert(it, forNext);
  };
}
