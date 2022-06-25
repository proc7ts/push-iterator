import type { Indexed$Elements } from '../base/indexed.impl';
import { indexed$process } from '../base/indexed.impl';
import { PushIterator$dontIterate, PushIterator$empty, PushIterator$noNext } from '../base/push-iterator.empty.impl';
import { PushIterator$iterator } from '../base/push-iterator.impl';
import { PushIterable, PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';

export function valueIndexed$<TIndexed extends Indexed$Elements, T, TValue>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => T,
    valueOf: (this: void, element: T) => TValue | false | null | undefined,
): PushIterable.Iterate<TValue> {
  return (accept, mode = PushIterationMode.Some) => {
    if (accept && mode > 0) {
      return indexed$process<TIndexed, TValue | false | null | undefined, TValue>(
          indexed,
          (source, index) => valueOf(elementOf(source, index)),
          value => value != null && value !== false ? accept(value) : void 0,
          mode,
      );
    }

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
      return PushIterator$empty;
    }

    let over = false;
    let iterate = (accept?: PushIterator.Acceptor<TValue>): void => {
      if (accept && !forNext(accept)) {
        over = true;
        iterate = PushIterator$dontIterate;
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
