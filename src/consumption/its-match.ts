import { iterateIt } from '../base/iterate-it';
import { PushIterationMode } from '../push-iteration-mode';

/**
 * Extracts the first element matching the given condition from `iterable`.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable to extract element from.
 * @param test - A predicate function to test elements. Returns truthy value for matching one. It accepts the tested
 * element as the only parameter.
 *
 * @returns Either the matching element, or `undefined` if no elements match.
 */
export function itsMatch<T>(iterable: Iterable<T>, test: (this: void, element: T) => boolean): T | undefined {

  let match: T | undefined;

  iterateIt(
      iterable,
      (element: T): boolean | void => {
        if (test(element)) {
          match = element;
          return false;
        }
      },
      PushIterationMode.Only,
  );

  return match;
}
