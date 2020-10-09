/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { PushIterator$dontIterate, PushIterator$iterator, PushIterator$noNext } from '../base/make-push-iterator';
import { overNone } from '../construction';
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
 * @typeParam T  A type of array elements.
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
  return makePushIterable(iterateOverFilteredArray(array, test));
}

/**
 * @internal
 */
function iterateOverFilteredArray<T>(
    array: ArrayLike<T>,
    test: (this: void, element: T) => boolean,
): PushIterable.Iterate<T> {
  return accept => {

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      for (; ;) {
        if (i >= array.length) {
          return false;
        }

        const value = array[i++];

        if (test(value)) {

          const status = accept(value);

          if (typeof status === 'boolean') {
            return status;
          }
        }
      }
    };

    if (accept && !forNext(accept)) {
      return overNone();
    }

    let over = false;
    let iterate = (accept?: PushIterator.Acceptor<T>): void => {
      if (accept && !forNext(accept)) {
        over = true;
        iterate = PushIterator$dontIterate;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        next = PushIterator$noNext;
      }
    };
    let next = (): IteratorResult<T> => {
      for (; ;) {
        if (i >= array.length) {
          over = true;
          iterate = PushIterator$dontIterate;
          next = PushIterator$noNext;
          return { done: true } as IteratorReturnResult<T>;
        }

        const value = array[i++];

        if (test(value)) {
          return { value };
        }
      }
    };

    return {
      [Symbol.iterator]: PushIterator$iterator,
      [PushIterator__symbol](accept) {
        iterate(accept);
        return this;
      },
      next: () => next(),
      isOver: () => over,
    };
  };
}
