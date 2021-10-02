import type { Indexed$Elements } from '../base/indexed.impl';
import { indexed$process } from '../base/indexed.impl';
import { PushIterator$dontIterate, PushIterator$empty, PushIterator$noNext } from '../base/push-iterator.empty.impl';
import { PushIterator$iterator } from '../base/push-iterator.impl';
import { PushIterable, PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';

export function filterIndexed$<TIndexed extends Indexed$Elements, T>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => T,
    test: (this: void, element: T) => boolean,
): PushIterable.Iterate<T> {
  return (accept, mode: PushIterationMode = PushIterationMode.Some) => {
    if (accept && mode > 0) {
      return indexed$process(
          indexed,
          elementOf,
          element => test(element) ? accept(element) : void 0,
          mode,
      );
    }

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      for (; ;) {
        if (i >= indexed.length) {
          return false;
        }

        const value = elementOf(indexed, i++);

        if (test(value)) {

          const status = accept(value);

          if (typeof status === 'boolean') {
            return status;
          }
        }
      }
    };

    if (accept && !forNext(accept)) {
      return PushIterator$empty;
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
      for (; ;) {
        if (i >= indexed.length) {
          over = true;
          iterate = PushIterator$dontIterate;
          next = PushIterator$noNext;

          return { done: true } as IteratorReturnResult<T>;
        }

        const value = elementOf(indexed, i++);

        if (test(value)) {
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
