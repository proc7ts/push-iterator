/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushOrRawIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterator';

/**
 * Performs the given `action` for each element of the given `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable of elements to perform actions on.
 * @param action  An action to perform on each iterable element. This is a function accepting an element as its only
 * parameter.
 */
export function itsEach<T>(iterable: PushOrRawIterable<T>, action: (this: void, element: T) => void): void {

  const iterate = iterable[PushIterator__symbol];

  if (iterate) {
    iterate().forNext(element => {
      action(element);
    });
  } else {
    for (const element of iterable) {
      action(element);
    }
  }
}
