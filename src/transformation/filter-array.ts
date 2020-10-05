/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { overNone } from '../construction';
import { PushIterator$iterate, PushIterator$iterator } from '../impl';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

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
  return array.length ? makePushIterable(iterateOverFilteredArray(array, test)) : overNone();
}

/**
 * @internal
 */
function iterateOverFilteredArray<T>(
    array: ArrayLike<T>,
    test: (this: void, element: T) => boolean,
): PushIterable.RawIterate<T> {
  return accept => {

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      for (; ;) {
        if (i >= array.length) {
          return false;
        }

        const value = array[i++];

        if (test(value) && accept(value) === false) {
          return true;
        }
      }
    };

    return accept
        ? forNext(accept)
        : {
          [Symbol.iterator]: PushIterator$iterator,
          [PushIterator__symbol]: PushIterator$iterate,
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
          forNext,
        };
  };
}
