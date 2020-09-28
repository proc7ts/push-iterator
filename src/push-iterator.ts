/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { arrayIterator } from './array-iterator.impl';
import type { PushIterable } from './push-iterable';
import { PushIterator$iterator, PushIterator$next } from './push-iterator.impl';

/**
 * Iterator implementing push iteration protocol.
 *
 * @typeParam T  Iterated elements type.
 */
export interface PushIterator<T> extends IterableIterator<T> {

  /**
   * Iterates over elements of this iterator.
   *
   * Calls `accept` method for each iterated element until there are elements to iterate, or `accept` returned `false`.
   *
   * Resumes iteration on subsequent calls.
   *
   * @param accept  A function to push iterated elements to. Accepts iterated element as its only parameter. May return
   * `false` to stop iteration.
   *
   * @returns `true` if there are more elements to iterate, or `false` otherwise. The former is possible only when
   * iteration stopped, i.e. `accept` returned `false`.
   */
  forNext(accept: (this: void, element: T) => boolean | void): boolean;

}

export const PushIterator = {

  /**
   * Checks whether the given iterator implements push iteration protocol.
   *
   * @param iterator  Target iterator to check.
   *
   * @returns `true` if `iterator` has {@link PushIterator.forNext forNext} method, or `false` otherwise.
   */
  is<T>(iterator: Iterator<T> | PushIterator<T>): iterator is PushIterator<T> {
    return !!(iterator as PushIterator<T>).forNext;
  },

  /**
   * Constructs push iterator implementation.
   *
   * @param forNext  A function iterating over element conforming to {@link PushIterator.forNext} requirement.
   *
   * @returns New push iterator instance performing iteration by `forNext` function.
   */
  by<T>(forNext: PushIterator<T>['forNext']): PushIterator<T> {
    return {
      [Symbol.iterator]: PushIterator$iterator,
      next: PushIterator$next,
      forNext,
    };
  },

};

/**
 * Starts iteration over the given `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable or push iterable to iterate over.
 *
 * @return A push iterator iterating over the given iterable.
 */
export function itsIterator<T>(iterable: Iterable<T> | PushIterable<T>): PushIterator<T> {
  if (Array.isArray(iterable)) {
    return arrayIterator(iterable);
  }

  const it = iterable[Symbol.iterator]();

  if (PushIterator.is(it)) {
    return it;
  }

  return PushIterator.by((accept: (this: void, element: T) => boolean | void): boolean => {
    for (;;) {

      const res = it.next();

      if (res.done) {
        return false;
      }
      if (accept(res.value) === false) {
        return true;
      }
    }
  });
}
