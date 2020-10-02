/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushOrRawIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterator';

/**
 * Applies a function against an accumulator and each element of the given `iterable` to reduce elements to a single
 * value.
 *
 * @typeParam T  A type of `iterable` elements.
 * @typeParam R  A type of reduced value.
 * @param iterable  An iterable to reduce values of.
 * @param reducer  A function to apply the value returned from the previous `reducer` call and to each element.
 * @param initialValue  Initial value passed to the first `reducer` call.
 *
 * @return Reduced value returned from the last `reducer` call, or `initialValue` if there is no elements in the given
 * `iterable`.
 */
export function itsReduction<T, R>(
    iterable: PushOrRawIterable<T>,
    reducer: (this: void, prev: R, element: T) => R,
    initialValue: R,
): R {

  const iterate = iterable[PushIterator__symbol];
  let reduced = initialValue;

  if (iterate) {
    iterate().forNext(element => {
      reduced = reducer(reduced, element);
    });
  } else {
    for (const element of iterable) {
      reduced = reducer(reduced, element);
    }
  }

  return reduced;
}
