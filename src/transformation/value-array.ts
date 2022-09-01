import { makePushIterable } from '../base';
import { arrayLike$elementOf } from '../base/array-like.impl';
import type { PushIterable } from '../push-iterable';
import { valueIndexed$ } from './value-indexed.impl';

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
 * @param array - A source array.
 * @param valueOf - A function that values elements, taking the source element as the only parameter, and returning
 * either its value, or `false`/`null`/`undefined` to filter it out.
 *
 * @returns New push iterable with array element values.
 */
export function valueArray<T, TValue = T>(
  array: ArrayLike<T>,
  valueOf: (this: void, element: T) => TValue | false | null | undefined,
): PushIterable<TValue> {
  return makePushIterable(valueIndexed$(array, arrayLike$elementOf, valueOf));
}
