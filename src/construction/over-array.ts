/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { PushIterator$iterate, PushIterator$iterator } from '../base/make-push-iterator';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { overNone } from './over-none';
import { overOne } from './over-one';

/**
 * Creates a {@link PushIterable push iterable} over elements of array-like structure.
 *
 * @typeParam T  Array elements type.
 * @param array  An array-like structure. E.g. `Array`, DOM `NodeList`, etc.
 *
 * @returns New push iterable over array elements.
 */
export function overArray<T>(array: ArrayLike<T>): PushIterable<T> {

  const length = array.length;

  return length > 1
      ? makePushIterable(iterateOverArray(array))
      : (!length ? overNone() : overOne(array[0]));
}

/**
 * @internal
 */
function iterateOverArray<T>(array: ArrayLike<T>): PushIterable.Iterate<T> {
  return accept => {

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      if (i >= array.length) {
        return false;
      }
      for (; ;) {

        const goOn = accept(array[i++]);

        if (i >= array.length) {
          return false;
        }
        if (goOn === false) {
          return true;
        }
      }
    };

    return accept
        ? forNext(accept)
        : {
          [Symbol.iterator]: PushIterator$iterator,
          [PushIterator__symbol]: PushIterator$iterate(forNext),
          next: () => i < array.length ? { value: array[i++] } : { done: true } as IteratorReturnResult<T>,
        };
  };
}

