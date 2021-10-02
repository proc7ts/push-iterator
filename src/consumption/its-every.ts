import { iterateIt } from '../base/iterate-it';
import { PushIterationMode } from '../push-iteration-mode';

/**
 * Tests whether all elements of the given `iterable` pass the test implemented by the provided function.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable to test elements of.
 * @param test - A predicate function to test each element. Returns `true` to continue tests, or `false` to stop it
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

  iterateIt(
      iterable,
      (element: T): boolean | void => {
        allMatch = !!test(element);

        return allMatch ? void 0 : false;
      },
      PushIterationMode.Only,
  );

  return allMatch;
}
