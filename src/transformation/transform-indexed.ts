import { indexedItemOf } from '../base/iterate-over-indexed.impl';
import type { IndexedItemList } from '../construction';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { transformIndexedElements } from './transform-indexed-elements.impl';

/**
 * Creates a {@link PushIterable | push iterable} iterating over transformed items of the given indexed list.
 *
 * @typeParam TSrc - A type of source elements.
 * @typeParam TConv - A type of converted elements.
 * @typeParam TState - Transformer's internal state type.
 * @param indexed - Source list of indexed items to transform.
 * @param transform - Source list items transformer.
 *
 * @returns Transformed push iterable.
 *
 * @see {@link PushIterator.Transformer} for transformation algorithm description.
 */
export function transformIndexed<TSrc, TConv = TSrc, TState = void>(
    indexed: IndexedItemList<TSrc>,
    transform: PushIterator.Transformer<TSrc, TConv, TState>,
): PushIterable<TConv> {
  return transformIndexedElements(indexed, indexedItemOf, transform);
}
