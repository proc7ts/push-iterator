/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { lengthOfArray } from '../base/iterate-over-array.impl';
import { iterateOverIndexed } from '../base/iterate-over-indexed.impl';
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
  return makePushIterable(iterateOverIndexed(
      array,
      (array, index) => convert(array[index]),
      lengthOfArray,
  ));
}
