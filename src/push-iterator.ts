/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterable } from './push-iterable';

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

/**
 * Checks whether the given iterator implements push iteration protocol.
 *
 * @param iterator  Target iterator to check.
 *
 * @returns `true` if `iterator` has {@link PushIterator.forNext forNext} method, or `false` otherwise.
 */
export function isPushIterator<T>(iterator: Iterator<T> | PushIterator<T>): iterator is PushIterator<T> {
  return !!(iterator as PushIterator<T>).forNext;
}

/**
 * @internal
 */
const PushIterator__noneForNext = (): false => false;

/**
 * Starts iteration over the given `iterable`.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable or push iterable to iterate over.
 *
 * @return A push iterator iterating over the given iterable.
 */
export function itsIterator<T>(iterable: Iterable<T> | PushIterable<T>): PushIterator<T> {

  const it = iterable[Symbol.iterator]();

  if (isPushIterator(it)) {
    return it;
  }

  let forNext = (accept: (this: void, element: T) => boolean | void): boolean => {
    for (;;) {

      const res = it.next();

      if (res.done) {
        forNext = PushIterator__noneForNext;
        return false;
      }

      if (accept(res.value) === false) {
        return true;
      }
    }
  };

  const result: PushIterator<T> = {

    [Symbol.iterator]() {
      return result;
    },

    next() {

      const result: {
        value?: T;
        done?: boolean;
      } = {};

      result.done = !forNext(element => {
        result.value = element;
        return false;
      });

      return result as IteratorResult<T>;
    },

    forNext(accept): boolean {
      return forNext(accept);
    },

  };

  return result;
}
