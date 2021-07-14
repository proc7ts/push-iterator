import { arrayElementOf } from '../base/iterate-over-array.impl';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { transformIndexedElements } from './transform-indexed-elements.impl';

/**
 * Creates a {@link PushIterable | push iterable} iterating over transformed elements of source `array`.
 *
 * @typeParam TSrc - A type of source elements.
 * @typeParam TConv - A type of converted elements.
 * @typeParam TState - Transformer's internal state type.
 * @param array - Source array to transform.
 * @param transform - Source elements transformer.
 *
 * @returns Transformed push iterable.
 *
 * @see {@link PushIterator.Transformer} for transformation algorithm description.
 */
export function transformArray<TSrc, TConv = TSrc, TState = void>(
    array: ArrayLike<TSrc>,
    transform: PushIterator.Transformer<TSrc, TConv, TState>,
): PushIterable<TConv> {
  return transformIndexedElements(array, arrayElementOf, transform);
}
