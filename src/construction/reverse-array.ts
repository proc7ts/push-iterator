/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { PushIterator$dontIterate, PushIterator$iterator, PushIterator$noNext } from '../base/make-push-iterator';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { overNone } from './over-none';

/**
 * Creates a {@link PushIterable push iterable} over elements of array-like structure in reverse order.
 *
 * @typeParam T  Array elements type.
 * @param array  An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns New push iterable over array elements in reverse order.
 */
export function reverseArray<T>(array: ArrayLike<T>): PushIterable<T> {
  return makePushIterable(iterateOverArrayReversely(array));
}

/**
 * @internal
 */
function iterateOverArrayReversely<T>(array: ArrayLike<T>): PushIterable.Iterate<T> {
  return accept => {

    let i = array.length - 1;
    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      if (i < 0) {
        return false;
      }

      for (; ;) {

        const status = accept(array[i--]);

        if (i < 0 || status === false) {
          return false;
        }
        if (status === true) {
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
      if (i < 0) {
        over = true;
        iterate = PushIterator$dontIterate;
        next = PushIterator$noNext;

        return { done: true } as IteratorReturnResult<T>;
      }

      return { value: array[i--] };
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
