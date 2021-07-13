import type { PushIterable } from '../push-iterable';
import { transformIt } from './transform-it';

/**
 * Creates a {@link PushIterable | push iterable} with all `source` iterable elements extending the given type.
 *
 * @typeParam T - A type of source elements.
 * @typeParam TTarget - Target type.
 * @param source - A source iterable.
 * @param test - A predicate function to test that element extends the type `TTarget`. Returns `true` to keep the
 * element, or`false` otherwise. It accepts the tested element as the only parameter.
 *
 * @returns New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterIt<T, TTarget extends T>(
    source: Iterable<T>,
    test: (this: void, element: T) => element is TTarget,
): PushIterable<TTarget>;

/**
 * Creates a {@link PushIterable | push iterable} with all `source` iterable elements that pass the test implemented by
 * the provided function.
 *
 * @typeParam T - A type of source elements.
 * @param source - A source iterable.
 * @param test - A predicate function to test each element. Returns `true` to keep the element, or `false` otherwise.
 * It accepts the tested element as the only parameter.
 *
 * @returns New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterIt<T>(
    source: Iterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T>;

export function filterIt<T>(
    source: Iterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T> {
  return transformIt(
      source,
      (push, src): boolean | void => {
        if (test(src) && push(src) === false) {
          return false;
        }
      },
  );
}
