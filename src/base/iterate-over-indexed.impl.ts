import type { IndexedItemList } from '../construction';
import { PushIterable, PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import {
  emptyPushIterator,
  PushIterator$dontIterate,
  PushIterator$iterator,
  PushIterator$noNext,
} from './make-push-iterator';

export interface IndexedElements {

  readonly length: number;

}

export function indexedItemOf<T>(indexed: IndexedItemList<T>, index: number): T {
  return indexed.item(index) as T; // The index is always valid.
}

export function iterateOverIndexed<TIndexed extends IndexedElements, T>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => T,
): PushIterable.Iterate<T> {
  return accept => {

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      if (i >= indexed.length) {
        return false;
      }
      for (; ;) {

        const goOn = accept(elementOf(indexed, i++));

        if (i >= indexed.length || goOn === false) {
          return false;
        }
        if (goOn === true) {
          return true;
        }
      }
    };

    if (accept && !forNext(accept)) {
      return emptyPushIterator;
    }

    let over = false;
    let iterate = (accept?: PushIterator.Acceptor<T>): void => {
      if (accept && !forNext(accept)) {
        over = true;
        iterate = PushIterator$dontIterate;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        next = PushIterator$noNext;
      }
    };
    let next = (): IteratorResult<T> => {
      if (i < indexed.length) {
        return { value: elementOf(indexed, i++) };
      }

      over = true;
      iterate = PushIterator$dontIterate;
      next = PushIterator$noNext;

      return { done: true } as IteratorReturnResult<T>;
    };

    return {
      [Symbol.iterator]: PushIterator$iterator,
      [PushIterator__symbol](accept) {
        iterate(accept);
        return this;
      },
      next: () => next(),
      isOver: () => over,
    };

  };
}
