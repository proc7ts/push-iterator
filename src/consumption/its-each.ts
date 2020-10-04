/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';

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

  if (forNext) {
    forNext(element => {
      action(element);
    });
  } else {
    rawEach(it, action);
  }
}

/**
 * @internal
 */
function rawEach<T>(it: Iterator<T>, action: (this: void, element: T) => void): void {

  let done: boolean | undefined;

  do {

    const next = it.next();

    if (!(done = next.done)) {
      action(next.value);
    }
  } while (!done);
}


