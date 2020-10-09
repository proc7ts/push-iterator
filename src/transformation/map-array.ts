/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { PushIterator$dontIterate, PushIterator$iterator, PushIterator$noNext } from '../base/make-push-iterator';
import { overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a {@link PushIterable push iterable} with the results of calling a provided function on every element of the
 * given `array`.
 *
 * @typeParam T  A type of array elements.
 * @typeParam R  A type of converted elements.
 * @param array  A source array-like instance.
 * @param convert  A function that produces an element of new iterable, taking array element as the only parameter.
 *
 * @returns New push iterable of transformed elements.
 */
export function mapArray<T, R>(
    array: ArrayLike<T>,
    convert: (this: void, element: T) => R,
): PushIterable<R> {
  return makePushIterable(iterateOverMappedArray(array, convert));
}

/**
 * @internal
 */
function iterateOverMappedArray<T, R>(
    array: ArrayLike<T>,
    convert: (this: void, element: T) => R,
): PushIterable.Iterate<R> {
  return accept => {

    let i = 0;
    const forNext = (accept: PushIterator.Acceptor<R>): boolean => {
      if (i >= array.length) {
        return false;
      }

      for (; ;) {

        const status = accept(convert(array[i++]));

        if (i >= array.length) {
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
    let iterate = (accept?: PushIterator.Acceptor<R>): void => {
      if (accept && !forNext(accept)) {
        over = true;
        iterate = PushIterator$dontIterate;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        next = PushIterator$noNext;
      }
    };
    let next = (): IteratorResult<R> => {
      if (i < array.length) {
        return { value: convert(array[i++]) };
      }

      over = true;
      iterate = PushIterator$dontIterate;
      next = PushIterator$noNext;

      return { done: true } as IteratorReturnResult<R>;
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
