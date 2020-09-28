/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import { PushIterator } from '../push-iterator';

/**
 * Performs the given `action` for each element of the given `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable of elements to perform actions on.
 * @param action  An action to perform on each iterable element. This is a function accepting an element as its only
 * parameter.
 */
export function itsEach<T>(iterable: Iterable<T> | PushIterable<T>, action: (this: void, element: T) => void): void {

  const it = iterable[Symbol.iterator]();

  if (PushIterator.is(it)) {
    it.forNext(element => {
      action(element);
    });
  } else {
    for (;;) {

      const res = it.next();

      if (res.done) {
        break;
      }

      action(res.value);
    }
  }
}
