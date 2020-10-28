/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { iterateOverIndexed } from '../base/iterate-over-indexed.impl';
import type { IndexedItemList } from '../construction';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable push iterable} with the results of calling a provided function on every item of the
 * given indexed list.
 *
 * @typeParam T  A type of indexed list items.
 * @typeParam R  A type of converted elements.
 * @param indexed  A source indexed items list.
 * @param convert  A function that produces an element of new iterable, taking list item as the only parameter.
 *
 * @returns New push iterable of transformed elements.
 */
export function mapIndexed<T, R>(
    indexed: IndexedItemList<T>,
    convert: (this: void, element: T) => R,
): PushIterable<R> {
  return makePushIterable(iterateOverIndexed(
      indexed,
      (list, index) => convert(list.item(index) as T /* The index is always valid */),
  ));
}
