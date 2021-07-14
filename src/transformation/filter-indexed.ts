import type { IndexedItemList } from '../construction';
import type { PushIterable } from '../push-iterable';
import { transformIndexed } from './transform-indexed';

/**
 * Creates a {@link PushIterable | push iterable} with all items of the given indexed list that extend the given type.
 *
 * @typeParam T - Indexed items type.
 * @typeParam TTarget - Target type.
 * @param indexed - Source indexed items list to filter.
 * @param test - Predicate function to test that item extends the type `TTarget`. Returns `true` to keep the element,
 * or `false` otherwise. It accepts the tested item as the only parameter.
 *
 * @returns New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterIndexed<T, TTarget extends T>(
    indexed: IndexedItemList<T>,
    test: (this: void, element: T) => element is TTarget,
): PushIterable<TTarget>;

/**
 * Creates a {@link PushIterable | push iterable} with all items of the given indexed list that pass the test
 * implemented by the provided function.
 *
 * @typeParam T - Indexed items type.
 * @param indexed - Source indexed items list to filter.
 * @param test - Predicate function to test each item. Returns `true` to keep the item, or `false` otherwise.
 * It accepts the tested item as the only parameter.
 *
 * @returns New push iterable with the items that pass the test. If no items passed the test, an empty iterable
 * will be returned.
 */
export function filterIndexed<T>(
    indexed: IndexedItemList<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T>;

export function filterIndexed<T>(
    indexed: IndexedItemList<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T> {
  return transformIndexed(
      indexed,
      (push, src): boolean | void => {
        if (test(src)) {
          return push(src);
        }
      },
  );
}
