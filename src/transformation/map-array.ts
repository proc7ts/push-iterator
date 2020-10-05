/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { overNone, overOne } from '../construction';
import { PushIterator$iterator } from '../impl';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable push iterable} with the results of calling a provided function on every element of the
 * given `array`.
 *
 * @typeParam T  A type of array elements.
 * @typeParam R  A type of converted elements.
 * @param array  A source array-like instance.
 * @param convert  A function that produces an element of new iterable, taking array element as the only parameter.
 *
 * @returns New push iterable of transformed elements.
 */
export function mapArray<T, R>(
    array: ArrayLike<T>,
    convert: (this: void, element: T) => R,
): PushIterable<R> {

  const length = array.length;

  if (length <= 1) {
    return length ? overOne(convert(array[0])) : overNone();
  }

  return {
    [Symbol.iterator]() {

      let i = 0;

      return {

        [Symbol.iterator]: PushIterator$iterator,

        next: () => i < array.length ? { value: convert(array[i++]) } : { done: true } as IteratorReturnResult<R>,

        forNext(accept) {
          if (i >= array.length) {
            return false;
          }

          for (; ;) {

            const goOn = accept(convert(array[i++]));

            if (i >= array.length) {
              return false;
            }
            if (goOn === false) {
              return true;
            }
          }
        },

      };
    },
  };
}
