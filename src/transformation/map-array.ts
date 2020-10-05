/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { overNone, overOne } from '../construction';
import { PushIterator$iterate, PushIterator$iterator } from '../impl';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

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

  return length > 1
      ? makePushIterable(iterateOverMappedArray(array, convert))
      : (length ? overOne(convert(array[0])) : overNone());
}

/**
 * @internal
 */
function iterateOverMappedArray<T, R>(
    array: ArrayLike<T>,
    convert: (this: void, element: T) => R,
): PushIterable.RawIterate<R> {
  return accept => {

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<R>): boolean => {
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
    };

    return accept
        ? forNext(accept)
        : {
          [Symbol.iterator]: PushIterator$iterator,
          [PushIterator__symbol]: PushIterator$iterate,
          next: () => i < array.length ? { value: convert(array[i++]) } : { done: true } as IteratorReturnResult<R>,
          forNext,
        };
  };
}
