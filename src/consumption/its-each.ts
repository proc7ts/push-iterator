/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';
import type { PushIterator } from '../push-iterator';

/**
 * Performs the given `action` for each element of the given `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable of elements to perform actions on.
 * @param action  An action to perform on each iterable element. This is a function accepting an element as its only
 * parameter.
 */
export function itsEach<T>(iterable: Iterable<T>, action: (this: void, element: T) => void): void {

  const it = iteratorOf(iterable);
  const forNext = it.forNext;

  return forNext ? pushedEach(forNext, action) : rawEach(it, action);
}

/**
 * @internal
 */
function pushedEach<T>(forNext: PushIterator.Pusher<T>, action: (this: void, element: T) => void): void {
  forNext(element => {
    action(element);
  });
}

/**
 * @internal
 */
function rawEach<T>(it: Iterator<T>, action: (this: void, element: T) => void): void {
  for (; ;) {

    const next = it.next();

    if (next.done) {
      return;
    }

    action(next.value);
  }
}


