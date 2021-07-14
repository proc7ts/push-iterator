import type { PushIterable } from '../push-iterable';
import { transformArray } from './transform-array';

/**
 * Creates a {@link PushIterable push iterable} with all `array` elements extending the given type.
 *
 * @typeParam T - A type of array elements.
 * @typeParam TTarget - Target type.
 * @param array - Source array to filter.
 * @param test - Predicate function to test that element extends the type `TTarget`. Returns `true` to keep the
 * element, or `false` otherwise. It accepts the tested element as the only parameter.
 *
 * @returns New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterArray<T, TTarget extends T>(
    array: ArrayLike<T>,
    test: (this: void, element: T) => element is TTarget,
): PushIterable<TTarget>;

/**
 * Creates a {@link PushIterable | push iterable} with all `array` elements that pass the test implemented by
 * the provided function.
 *
 * @typeParam T - A type of array elements.
 * @param array - Source array to filter.
 * @param test - Predicate function to test each element. Returns `true` to keep the element, or `false` otherwise.
 * It accepts the tested element as the only parameter.
 *
 * @returns New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterArray<T>(
    array: ArrayLike<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T>;

export function filterArray<T>(
    array: ArrayLike<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T> {
  return transformArray(
      array,
      (push, src): boolean | void => {
        if (test(src)) {
          return push(src);
        }
      },
  );
}
