import { makePushIterable } from '../base';
import { PushIterator$dontIterate, PushIterator$empty, PushIterator$noNext } from '../base/push-iterator.empty.impl';
import { PushIterator$iterator } from '../base/push-iterator.impl';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';
import { overNone } from './over-none';

/**
 * Creates a {@link PushIterable | push iterable} over elements of array-like structure in reverse order.
 *
 * @typeParam T - Array elements type.
 * @param array - An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns New push iterable over array elements in reverse order.
 */
export function reverseArray<T>(array: ArrayLike<T>): PushIterable<T> {
  return makePushIterable(reverseArray$iterate(array));
}

function reverseArray$iterate<T>(array: ArrayLike<T>): PushIterable.Iterate<T> {
  return (
      accept?: PushIterator.Acceptor<T>,
      mode: PushIterationMode = PushIterationMode.Some,
  ): PushIterator<T> => {
    if (accept && mode > 0) {
      return reverseArray$process(array, accept, mode);
    }

    let i = array.length - 1;
    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      if (i < 0) {
        return false;
      }

      for (; ;) {

        const status = accept(array[i--]);

        if (i < 0) {
          return false;
        }
        if (typeof status === 'boolean') {
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

function reverseArray$process<T>(
    array: ArrayLike<T>,
    accept: PushIterator.Acceptor<T>,
    mode: PushIterationMode /* PushIterationMode.Only | PushIterationMode.All */,
): PushIterator<T> {
  if (mode === PushIterationMode.All) {
    for (let i = array.length - 1; i >= 0; --i) {
      accept(array[i]);
    }
  } else {
    for (let i = array.length - 1; i >= 0; --i) {
      if (accept(array[i]) === false) {
        break;
      }
    }
  }

  return PushIterator$empty;
}
