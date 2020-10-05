/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';
import type { PushIterator } from '../push-iterator';

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
    iterable: Iterable<T>,
    reducer: (this: void, prev: R, element: T) => R,
    initialValue: R,
): R {

  const it = iteratorOf(iterable);

  return it.forNext ? pushedReduction(it, reducer, initialValue) : rawReduction(it, reducer, initialValue);
}

/**
 * @internal
 */
function pushedReduction<T, R>(
    it: PushIterator<T>,
    reducer: (this: void, prev: R, element: T) => R,
    reduced: R,
): R {
  it.forNext(element => {
    reduced = reducer(reduced, element);
  });
  return reduced;
}

/**
 * @internal
 */
function rawReduction<T, R>(
    it: Iterator<T>,
    reducer: (this: void, prev: R, element: T) => R,
    reduced: R,
): R {
  for (; ;) {

    const next = it.next();

    if (next.done) {
      return reduced;
    }

    reduced = reducer(reduced, next.value);
  }
}
