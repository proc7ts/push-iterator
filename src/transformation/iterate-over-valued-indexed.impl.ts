import type { IndexedElements } from '../base/iterate-over-indexed.impl';
import { PushIterator$dontIterate, PushIterator$iterator, PushIterator$noNext } from '../base/make-push-iterator';
import { overNone } from '../construction';
import { PushIterable, PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * @internal
 */
export function iterateOverValuedIndexed<TIndexed extends IndexedElements, T, TValue>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => T,
    valueOf: (this: void, element: T) => TValue | false | null | undefined,
): PushIterable.Iterate<TValue> {
  return accept => {

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<TValue>): boolean => {
      for (; ;) {
        if (i >= indexed.length) {
          return false;
        }

        const value = valueOf(elementOf(indexed, i++));

        if (value != null && value !== false) {

          const status = accept(value);

          if (typeof status === 'boolean') {
            return status;
          }
        }
      }
    };

    if (accept && !forNext(accept)) {
      return overNone();
    }

    let over = false;
    let iterate = (accept?: PushIterator.Acceptor<TValue>): void => {
      if (accept && !forNext(accept)) {
        over = true;
        iterate = PushIterator$dontIterate;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        next = PushIterator$noNext;
      }
    };
    let next = (): IteratorResult<TValue> => {
      for (; ;) {
        if (i >= indexed.length) {
          over = true;
          iterate = PushIterator$dontIterate;
          next = PushIterator$noNext;
          return { done: true } as IteratorReturnResult<T>;
        }

        const value = valueOf(elementOf(indexed, i++));

        if (value != null && value !== false) {
          return { value };
        }
      }
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
