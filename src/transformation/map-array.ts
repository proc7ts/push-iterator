import { makePushIterable } from '../base';
import { iterateIndexed } from '../base/iterate-indexed.impl';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable | push iterable} with the results of calling a provided function on every element
 * of the given `array`.
 *
 * @typeParam TSrc - A type of array elements.
 * @typeParam TConv - A type of converted elements.
 * @param array - A source array-like instance.
 * @param convert - A function that produces an element of new iterable, taking array element as the only parameter.
 *
 * @returns New push iterable of transformed elements.
 */
export function mapArray<TSrc, TConv>(
    array: ArrayLike<TSrc>,
    convert: (this: void, element: TSrc) => TConv,
): PushIterable<TConv> {
  return makePushIterable(accept => iterateIndexed(
      array,
      (array, index) => convert(array[index]),
      accept,
  ));
}
