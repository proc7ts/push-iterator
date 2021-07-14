import type { PushIterable } from '../push-iterable';
import { transformArray } from './transform-array';

/**
 * Creates a {@link PushIterable | push iterable} with the values of elements of the given `array`.
 *
 * Element value is the result of provided function call, except `false`, `null`, and `undefined` which are filtered
 * out.
 *
 * This can be used as a more effective {@link mapArray} / {@link filterIt} combination.
 *
 * @typeParam T - A type of array elements.
 * @typeParam TValue - A type of array element values.
 * @param array - Source array.
 * @param valueOf - Function that values elements, taking the source element as the only parameter, and returning
 * either its value, or `false`/`null`/`undefined` to filter it out.
 *
 * @returns New push iterable with array element values.
 */
export function valueArray<T, TValue>(
    array: ArrayLike<T>,
    valueOf: (this: void, element: T) => TValue | false | null | undefined,
): PushIterable<TValue> {
  return transformArray(
      array,
      (push, src): boolean | void => {

        const value = valueOf(src);

        if (value != null && value !== false) {
          return push(value);
        }
      },
  );
}
