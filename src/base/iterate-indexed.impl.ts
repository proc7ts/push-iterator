import type { IndexedItemList } from '../construction';
import type { PushIterator } from '../push-iterator';
import { iterateGenerated } from './iterate-generated';

export interface IndexedElements {

  readonly length: number;

}

export function indexedItemOf<T>(indexed: IndexedItemList<T>, index: number): T {
  return indexed.item(index) as T; // The index is always valid.
}

export function iterateIndexed<TIndexed extends IndexedElements, T>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => T,
    accept?: PushIterator.Acceptor<T>,
): PushIterator<T> {
  return iterateGenerated<T, number>(
      (push, i = 0) => {
        while (i < indexed.length) {

          const result = push(elementOf(indexed, i), ++i);

          if (result != null) {
            return result;
          }
        }

        return false;
      },
      accept,
  );
}
