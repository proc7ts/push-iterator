/**
 * Applies a function against an accumulator and each element of the given `iterable` to reduce elements to a single
 * value.
 *
 * @typeParam T - Iterated elements type.
 * @typeParam TResult - A type of reduced value.
 * @param iterable - An iterable to reduce values of.
 * @param reducer - A function to apply the value returned from the previous `reducer` call and to each element.
 * @param initialValue - Initial value passed to the first `reducer` call.
 *
 * @returns Reduced value returned from the last `reducer` call, or `initialValue` if there is no elements in the given
 * `iterable`.
 */
import { iterateIt } from '../base';

export function itsReduction<T, TResult>(
    iterable: Iterable<T>,
    reducer: (this: void, prev: TResult, element: T) => TResult,
    initialValue: TResult,
): TResult {

  let reduced = initialValue;

  iterateIt(iterable, element => { reduced = reducer(reduced, element); });

  return reduced;
}
