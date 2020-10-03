/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { overNone, overOne } from '../construction';
import { PushIterable, PushIterable__symbol } from '../push-iterable';
import { PushIterator$iterator } from '../push-iterator.impl';

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
  if (array.length <= 1) {
    if (!array.length) {
      return overNone();
    }
    return overOne(convert(array[0]));
  }

  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]() {

      let i = 0;

      return {

        [PushIterable__symbol]: 1,

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
