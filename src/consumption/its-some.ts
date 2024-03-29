import { iterateIt } from '../base/iterate-it';
import { PushIterationMode } from '../push-iteration-mode';

/**
 * Tests whether at least one element of the given `iterable` passes the test implemented by the provided function.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable to test elements of.
 * @param test - A predicate function to test each element. Returns `false` to continue tests, or `true` to stop it
 * and return `true` from the method call. It accepts the tested element as the only parameter.
 *
 * @returns `true` if the callback function returned a truthy value for at least one element in the array, or `false`
 * otherwise. Returns `false` for empty iterable.
 */
export function itsSome<T>(
  iterable: Iterable<T>,
  test: (this: void, element: T) => boolean,
): boolean {
  let someMatches = false;

  iterateIt(
    iterable,
    (element: T): boolean | void => {
      someMatches = !!test(element);

      return someMatches ? false : void 0;
    },
    PushIterationMode.Only,
  );

  return someMatches;
}
