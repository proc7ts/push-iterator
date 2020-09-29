/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterator } from '../its-iterator';
import type { PushIterable } from '../push-iterable';

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
    iterable: Iterable<T> | PushIterable<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  let someMatches = false;

  itsIterator(iterable).forNext(element => !(someMatches = test(element)));

  return someMatches;
}
