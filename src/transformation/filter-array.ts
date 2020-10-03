/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { overNone } from '../construction';
import { PushIterable, PushIterable__symbol } from '../push-iterable';
import { PushIterator$iterator } from '../push-iterator.impl';

/**
 * Creates a {@link PushIterable push iterable} with all `array` elements that pass the test implemented by
 * the provided function.
 *
 * @typeParam T  A type of array elements.
 * @param array  A source array.
 * @param test  A predicate function to test each element. Returns `true` to keep the element, or `false` otherwise.
 * It accepts the tested element as the only parameter.
 *
 * @return New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterArray<T>(
    array: ArrayLike<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T>;

/**
 * Creates a {@link PushIterable push iterable} with all `array` elements extending the given type.
 *
 * @typeParam T  A type of array elements
 * @typeParam R  Target type.
 * @param array  A source array.
 * @param test  A predicate function to test that element extends the type `R`. Returns `true` to keep the element, or
 * `false` otherwise. It accepts the tested element as the only parameter.
 *
 * @return New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterArray<T, R extends T>(
    array: ArrayLike<T>,
    test: (this: void, element: T) => element is R,
): PushIterable<R>;

export function filterArray<T>(
    array: ArrayLike<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T> {
  if (!array.length) {
    return overNone();
  }

  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]() {

      let i = 0;

      return {

        [PushIterable__symbol]: 1,
        [Symbol.iterator]: PushIterator$iterator,

        next() {
          for (; ;) {
            if (i >= array.length) {
              return { done: true } as IteratorReturnResult<T>;
            }

            const value = array[i++];

            if (test(value)) {
              return { value };
            }
          }
        },

        forNext(accept) {
          for (; ;) {
            if (i >= array.length) {
              return false;
            }

            const value = array[i++];

            if (test(value) && accept(value) === false) {
              return true;
            }
          }
        },

      };
    },
  };
}
