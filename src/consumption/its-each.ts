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

  if (it.forNext) {
    pushedEach(it, action);
  } else {
    rawEach(it, action);
  }
}

/**
 * @internal
 */
function pushedEach<T>(it: PushIterator<T>, action: (this: void, element: T) => void): void {
  it.forNext(element => {
    action(element);
  });
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


