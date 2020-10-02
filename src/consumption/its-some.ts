/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushOrRawIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterator';

/**
 * Tests whether at least one element of the given `iterable` passes the test implemented by the provided function.
 *
 * @typeParam T  A type of `iterable` elements.
 * @param iterable  An iterable to test elements of.
 * @param test  A predicate function to test each element. Returns `false` to continue tests, or `true` to stop it
 * and return `true` from the method call. It accepts the tested element as the only parameter.
 *
 * @returns `true` if the callback function returned a truthy value for at least one element in the array, or `false`
 * otherwise. Returns `false` for empty iterable.
 */
export function itsSome<T>(
    iterable: PushOrRawIterable<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  const iterate = iterable[PushIterator__symbol];
  let someMatches = false;

  if (iterate) {
    iterate().forNext(element => !(someMatches = !!test(element)));
  } else {
    for (const element of iterable) {
      if ((someMatches = !!test(element))) {
        break;
      }
    }
  }

  return someMatches;
}
