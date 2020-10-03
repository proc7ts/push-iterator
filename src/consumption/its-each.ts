/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushOrRawIterable } from '../push-iterable';
import { isPushIterable } from '../push-iterable';

/**
 * Performs the given `action` for each element of the given `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable of elements to perform actions on.
 * @param action  An action to perform on each iterable element. This is a function accepting an element as its only
 * parameter.
 */
export function itsEach<T>(iterable: PushOrRawIterable<T>, action: (this: void, element: T) => void): void {
  if (isPushIterable(iterable)) {
    iterable[Symbol.iterator]().forNext(element => {
      action(element);
    });
  } else {
    for (const element of iterable) {
      action(element);
    }
  }
}
