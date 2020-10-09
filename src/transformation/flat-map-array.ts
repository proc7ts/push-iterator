/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable, makePushIterator } from '../base';
import { overNone } from '../construction';
import { itsHead } from '../consumption';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { flatMapIt$defaultConverter } from './transformation.impl';

/**
 * Flattens the source `array` of iterables into new {@link PushIterable push iterable}.
 *
 * Calling this function is the same as calling `flatMapArray(source, element => element)`.
 *
 * @typeParam T  A type of converted elements.
 * @param array  A source array-like instance of iterables.
 *
 * @returns New push iterable with each element of `array` being the flattened.
 */
export function flatMapArray<T>(array: ArrayLike<Iterable<T>>): PushIterable<T>;

/**
 * First maps each element of the source `array` using a mapping function, then flattens the result into new
 * {@link PushIterable push iterable}.
 *
 * @typeParam T  A type of array elements.
 * @typeParam R  A type of converted elements.
 * @param array  A source array-like instance of iterables.
 * @param convert  A function that produces new iterable, taking array element as the only parameter.
 *
 * @returns New push iterable with each element being the flattened result of the `convert` function call.
 */
export function flatMapArray<T, R>(
    array: ArrayLike<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterable<R>;

export function flatMapArray<T, R>(
    array: ArrayLike<T>,
    convert: (this: void, element: T) => Iterable<R> = flatMapIt$defaultConverter,
): PushIterable<R> {
  return makePushIterable(iterateOverFlattenedArray(array, convert));
}

/**
 * @internal
 */
function iterateOverFlattenedArray<T, R>(
    array: ArrayLike<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterable.Iterate<R> {
  return accept => {

    let i = 0;
    let subs: Iterable<R> | undefined;

    const forNext = (accept: PushIterator.Acceptor<R>): boolean => {
      if (i >= array.length) {
        return false;
      }
      if (!subs) {
        subs = convert(array[i]);
      }

      for (; ;) {

        let status: boolean | void;
        const subsTail: PushIterator<R> = itsHead<R>(subs, element => status = accept(element));

        if (subsTail.isOver()) {
          if (++i >= array.length) {
            return false;
          }
          subs = convert(array[i]);
        } else {
          subs = subsTail;
        }

        if (typeof status === 'boolean') {
          return status;
        }
      }
    };

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  };
}
