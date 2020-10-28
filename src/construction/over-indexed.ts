/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { iterateOverIndexed } from '../base/iterate-over-indexed.impl';
import type { PushIterable } from '../push-iterable';

/**
 * An indexed list of items.
 *
 * @typeParam T  Indexed item value.
 */
export interface IndexedItemList<T> {

  /**
   * The length of the list. I.e. the number of items it contains.
   */
  readonly length: number;

  /**
   * Retrieves an item under the given index.
   *
   * @param index  Item index.
   *
   * @returns Either item value, or `null`/`undefined` if there is no item with such index, i.e. if the index is not
   * an integer value, is negative, or greater or equal to the [length].
   */
  item(index: number): T | null | undefined;

}

/**
 * @internal
 */
export function indexedItemOf<T>(indexed: IndexedItemList<T>, index: number): T {
  return indexed.item(index) as T; // The index is always valid.
}

/**
 * Creates a {@link PushIterable push iterable} over items of {@link IndexedItemList indexed list}.
 *
 * @typeParam T  Array elements type.
 * @param indexed  An indexed list of items. E.g. DOM `NodeList`.
 *
 * @returns New push iterable over list items.
 */
export function overIndexed<T>(indexed: IndexedItemList<T>): PushIterable<T> {
  return makePushIterable(iterateOverIndexed(indexed, indexedItemOf));
}
