/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterator } from '../its-iterator';
import type { PushIterable } from '../push-iterable';

/**
 * Tests whether all elements of the given `iterable` pass the test implemented by the provided function.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to test elements of.
 * @param test  A predicate function to test each element. Returns `true` to continue tests, or `false` to stop it
 * and return `false` from the method call. It accepts the tested element as the only parameter.
 *
 * @returns `true` if the `test` function returned a truthy value for every element, or `false` otherwise.
 * Returns `true` for empty iterable.
 */
export function itsEvery<T>(
    iterable: Iterable<T> | PushIterable<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  let allMatch = true;

  itsIterator(iterable).forNext(element => allMatch = !!test(element));

  return allMatch;
}
