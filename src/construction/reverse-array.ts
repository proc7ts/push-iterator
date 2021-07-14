import { iterateGenerated } from '../base';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable | push iterable} over elements of array-like structure in reverse order.
 *
 * @typeParam T - Array elements type.
 * @param array - An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns New push iterable over array elements in reverse order.
 */
export function reverseArray<T>(array: ArrayLike<T>): PushIterable<T> {
  return iterateGenerated<T, number>(
      (push, i = array.length - 1) => {
        while (i >= 0) {

          const result = push(array[i], --i);

          if (result != null) {
            return result;
          }
        }

        return false;
      },
  );
}
