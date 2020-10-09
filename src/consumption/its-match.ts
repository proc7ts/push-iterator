/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterated } from './its-iterated';

/**
 * Extracts the first element matching the given condition from `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to extract element from.
 * @param test  A predicate function to test elements. Returns truthy value for matching one. It accepts the tested
 * element as the only parameter.
 *
 * @return Either the matching element, or `undefined` if no elements match.
 */
export function itsMatch<T>(iterable: Iterable<T>, test: (this: void, element: T) => boolean): T | undefined {

  let match: T | undefined;

  itsIterated(
      iterable,
      element => {
        if (test(element)) {
          match = element;
          return true;
        }
        return;
      },
  );

  return match;
}
