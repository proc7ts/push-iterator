/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterator, makePushIterable, makePushIterator, pushIterated } from '../base';
import { overIterable, overNone } from '../construction';
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

  const length = array.length;

  return length > 1
      ? makePushIterable(iterateOverFlattenedArray(array, convert))
      : (length ? overIterable(convert(array[0])) : overNone());
}

/**
 * @internal
 */
function iterateOverFlattenedArray<T, R>(
    array: ArrayLike<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterable.Iterate<R> {
  return accept => {

    let subIt = itsIterator(convert(array[0]));
    let index = 1;
    const forNext = (accept: PushIterator.Acceptor<R>): boolean => {
      for (; ;) {

        let goOn: boolean | void;

        if (!pushIterated(subIt, element => goOn = accept(element))) {
          if (index >= array.length) {
            return false;
          }
          subIt = itsIterator(convert(array[index++]));
        }
        if (goOn === false) {
          return true;
        }
      }
    };

    return accept ? forNext(accept) : makePushIterator(forNext);
  };
}
