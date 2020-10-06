/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { PushIterator$iterate, PushIterator$iterator } from '../base/make-push-iterator';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

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

        const goOn = accept(array[i--]);

        if (i < 0) {
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
          next: () => i < 0 ? { done: true } as IteratorReturnResult<T> : { value: array[i--] },
        };
  };
}
