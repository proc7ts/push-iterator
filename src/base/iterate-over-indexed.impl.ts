import { PushIterable, PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import {
  emptyPushIterator,
  PushIterator$dontIterate,
  PushIterator$iterator,
  PushIterator$noNext,
} from './make-push-iterator';

/**
 * @internal
 */
export function iterateOverIndexed<TIndexed, TItem>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => TItem,
    lengthOf: (indexed: TIndexed) => number,
): PushIterable.Iterate<TItem> {
  return accept => {

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<TItem>): boolean => {
      if (i >= lengthOf(indexed)) {
        return false;
      }
      for (; ;) {

        const goOn = accept(elementOf(indexed, i++));

        if (i >= lengthOf(indexed) || goOn === false) {
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
    let iterate = (accept?: PushIterator.Acceptor<TItem>): void => {
      if (accept && !forNext(accept)) {
        over = true;
        iterate = PushIterator$dontIterate;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        next = PushIterator$noNext;
      }
    };
    let next = (): IteratorResult<TItem> => {
      if (i < lengthOf(indexed)) {
        return { value: elementOf(indexed, i++) };
      }

      over = true;
      iterate = PushIterator$dontIterate;
      next = PushIterator$noNext;

      return { done: true } as IteratorReturnResult<TItem>;
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
