import type { IndexedItemList } from '../construction';
import type { PushIterable } from '../push-iterable';
import { flatMap$transformer } from './flat-map.transformer.impl';
import { transformIndexed } from './transform-indexed';

/**
 * Flattens the source list of indexed iterables into new {@link PushIterable | push iterable}.
 *
 * Calling this function is the same as calling `flatMapIndexed(source, element => element)`.
 *
 * @typeParam T - A type of converted elements.
 * @param indexed - Source list of indexed iterables to flatten.
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
 * @param indexed - Source list of indexed items to convert.
 * @param convert - Converter function that produces new iterable, taking the list item as the only parameter.
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
  return transformIndexed(indexed, flatMap$transformer(convert));
}
