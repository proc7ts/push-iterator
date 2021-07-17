import { makePushIterable } from '../base';
import { indexed$itemOf, indexed$iterate } from '../base/indexed.impl';
import type { PushIterable } from '../push-iterable';

/**
 * An indexed list of items.
 *
 * @typeParam T - Indexed item value.
 */
export interface IndexedItemList<T> {

  /**
   * The length of the list. I.e. the number of items it contains.
   */
  readonly length: number;

  /**
   * Retrieves an item under the given index.
   *
   * @param index - Item index.
   *
   * @returns Either item value, or `null`/`undefined` if there is no item with such index, i.e. if the index is not
   * an integer value, is negative, or greater or equal to the {@link length}.
   */
  item(index: number): T | null | undefined;

}

/**
 * Creates a {@link PushIterable | push iterable} over items of {@link IndexedItemList | indexed list}.
 *
 * @typeParam T - Indexed items type.
 * @param indexed - An indexed list of items. E.g. DOM `NodeList`.
 *
 * @returns New push iterable over list items.
 */
export function overIndexed<T>(indexed: IndexedItemList<T>): PushIterable<T> {
  return makePushIterable(indexed$iterate(indexed, indexed$itemOf));
}
