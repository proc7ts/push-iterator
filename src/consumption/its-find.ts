/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterated } from './its-iterated';

/**
 * Searches for the value in `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @typeParam R  Value type.
 * @param iterable  An iterable to extract element from.
 * @param search  A function extracting the value from elements. It is called for each iterated element until the value
 * found. Accepts element as the only parameter, and returns extracted value. If returns `false` or `undefined` the
 * search continues from the next element.
 *
 * @return Either found value or `undefined`.
 */
export function itsFind<T, R>(
    iterable: Iterable<T>,
    search: (this: void, element: T) => R | false | undefined,
): R | undefined {

  let find: R | undefined;

  itsIterated(
      iterable,
      element => {

        const result = search(element);

        if (result !== false && result !== undefined) {
          find = result;
          return true;
        }

        return;
      },
  );

  return find;
}
