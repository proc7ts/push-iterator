/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterated } from './its-iterated';

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
    iterable: Iterable<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  let allMatch = true;

  itsIterated(
      iterable,
      element => {
        allMatch = !!test(element);
        if (!allMatch) {
          return false;
        }
        return;
      },
  );

  return allMatch;
}
