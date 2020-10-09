import { overNone } from '../construction';
import { PushIterable, PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$dontIterate, PushIterator$iterator, PushIterator$noNext } from './make-push-iterator';

/**
 * @internal
 */
export function iterateOverArray<T>(array: ArrayLike<T>): PushIterable.Iterate<T> {
  return accept => {

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      if (i >= array.length) {
        return false;
      }
      for (; ;) {

        const goOn = accept(array[i++]);

        if (i >= array.length || goOn === false) {
          return false;
        }
        if (goOn === true) {
          return true;
        }
      }
    };

    if (accept && !forNext(accept)) {
      return overNone();
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
      if (i < array.length) {
        return { value: array[i++] };
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
