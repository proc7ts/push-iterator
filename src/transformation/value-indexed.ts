/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { indexedItemOf } from '../base/iterate-over-indexed.impl';
import type { IndexedItemList } from '../construction';
import type { PushIterable } from '../push-iterable';
import { iterateOverValuedIndexed } from './iterate-over-valued-indexed.impl';

/**
 * Creates a {@link PushIterable | push iterable} with the values of items of the given indexed list.
 *
 * Item value is the result of provided function call, except `false`, `null`, and `undefined` which are filtered out.
 *
 * This can be used as a more effective {@link mapIndexed} / {@link filterIt} combination.
 *
 * @typeParam T - Indexed items type.
 * @typeParam TValue - A type of item values.
 * @param indexed - A source indexed items list.
 * @param valueOf - A function that values items, taking the source item as the only parameter, and returning either
 * its value, or `false`/`null`/`undefined` to filter it out.
 *
 * @returns New push iterable with the item values.
 */
export function valueIndexed<T, TValue>(
    indexed: IndexedItemList<T>,
    valueOf: (this: void, element: T) => TValue | false | null | undefined,
): PushIterable<TValue> {
  return makePushIterable(iterateOverValuedIndexed(indexed, indexedItemOf, valueOf));
}
