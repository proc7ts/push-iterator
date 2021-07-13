import { makePushIterable } from '../base';
import type { IndexedItemList } from '../construction';
import type { PushIterable } from '../push-iterable';
import { iterateOverFlattenedIndexed } from './iterate-over-flattened-indexed.impl';

/**
 * Flattens the source list of indexed iterables into new {@link PushIterable | push iterable}.
 *
 * Calling this function is the same as calling `flatMapIndexed(source, element => element)`.
 *
 * @typeParam T - A type of converted elements.
 * @param indexed - A source list of indexed iterables.
 *
 * @returns New push iterable with each element of indexed list being flattened.
 */
export function flatMapIndexed<T>(indexed: IndexedItemList<Iterable<T>>): PushIterable<T>;

/**
 * First maps each item of the source indexed list using a mapping function, then flattens the result into new
 * {@link PushIterable | push iterable}.
 *
 * @typeParam TSrc - A type of indexed items.
 * @typeParam TConv - A type of converted elements.
 * @param indexed - A source list of indexed items to convert.
 * @param convert - A function that produces new iterable, taking the list item as the only parameter.
 *
 * @returns New push iterable with each element being the flattened result of the `convert` function call.
 */
export function flatMapIndexed<TSrc, TConv>(
    indexed: IndexedItemList<TSrc>,
    convert: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterable<TConv>;

export function flatMapIndexed<TSrc, TConv>(
    indexed: IndexedItemList<TSrc>,
    convert?: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterable<TConv> {
  return makePushIterable(iterateOverFlattenedIndexed<IndexedItemList<TSrc>, TConv>(
      indexed,
      convert
          ? (indexed, index) => convert(indexed.item(index) as TSrc)
          : flatMapIndexed$defaultElementOf,
  ));
}

function flatMapIndexed$defaultElementOf<TSrc, TConv>(
    indexed: IndexedItemList<TSrc>,
    index: number,
): Iterable<TConv> {
  return indexed.item(index) as unknown as Iterable<TConv>;
}
