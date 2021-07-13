import type { IndexedItemList } from '../construction';
import type { PushIterator } from '../push-iterator';
import { iterateOver } from './iterate-over';

export interface IndexedElements {

  readonly length: number;

}

export function indexedItemOf<T>(indexed: IndexedItemList<T>, index: number): T {
  return indexed.item(index) as T; // The index is always valid.
}

export function iterateOverIndexed<TIndexed extends IndexedElements, T>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => T,
    accept?: PushIterator.Acceptor<T>,
): PushIterator<T> {
  return iterateOver<T, number>(
      (push, i = 0) => {
        if (i < indexed.length) {
          while (push(elementOf(indexed, i), ++i < indexed.length ? i : null) == null) {
            // Iterate while needed or possible
          }
        }
      },
      accept,
  );
}
