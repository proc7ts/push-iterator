import type { PushIterable } from '../push-iterable';
import { flatMapArray$, flatMapArray$defaultElementOf } from './flat-map-array.impl';

/**
 * Flattens the source `array` of iterables into new {@link PushIterable | push iterable}.
 *
 * Calling this function is the same as calling `flatMapArray(source, element => element)`.
 *
 * @typeParam T - A type of converted elements.
 * @param array - A source array-like instance of iterables.
 *
 * @returns New push iterable with each element of `array` being flattened.
 */
export function flatMapArray<T>(array: ArrayLike<Iterable<T>>): PushIterable<T>;

/**
 * First maps each element of the source `array` using a mapping function, then flattens the result into new
 * {@link PushIterable | push iterable}.
 *
 * @typeParam TSrc - A type of array elements.
 * @typeParam TConv - A type of converted elements.
 * @param array - A source array-like instance of elements to convert.
 * @param convert - A function that produces new iterable, taking array element as the only parameter.
 *
 * @returns New push iterable with each element being the flattened result of the `convert` function call.
 */
export function flatMapArray<TSrc, TConv>(
    array: ArrayLike<TSrc>,
    convert: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterable<TConv>;

export function flatMapArray<TSrc, TConv>(
    array: ArrayLike<TSrc>,
    convert?: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterable<TConv> {
  return flatMapArray$<TSrc, TConv>(
      array,
      convert
          ? (array, index) => convert(array[index])
          : flatMapArray$defaultElementOf,
  );
}
