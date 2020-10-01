/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushOrRawIterable } from '../push-iterable';

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

  let reduced = initialValue;
  const it = iterable[Symbol.iterator]();
  const forNext = it.forNext;

  if (forNext) {
    forNext(element => {
      reduced = reducer(reduced, element);
    });
  } else {
    for (;;) {

      const res = it.next();

      if (res.done) {
        break;
      }

      reduced = reducer(reduced, res.value);
    }
  }

  return reduced;
}
