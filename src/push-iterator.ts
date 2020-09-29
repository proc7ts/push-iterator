/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
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
