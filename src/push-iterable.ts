/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterator } from './push-iterator';

/**
 * A key of {@link PushIterable} iteration method.
 */
export const PushIterator__symbol = (/*#__PURE__*/ Symbol('push-iterator'));

/**
 * An iterable implementing push iteration protocol.
 *
 * @typeParam T  Iterated elements type.
 */
export interface PushIterable<T> extends Iterable<T> {

  /**
   * Creates a {@link PushIterator push iterator} over elements of this iterable.
   *
   * @returns New push iterator instance.
   */
  [Symbol.iterator](): PushIterator<T>;

  /**
   * Iterates over elements of this push iterable.
   *
   * Calls `accept` method for each iterated element until there are elements to iterate, or `accept` returned either
   * `true` or `false`.
   *
   * Calling this method with `accept` parameter is a faster alternative to creating a push iterator and iterating with
   * it.
   *
   * Calling this method without arguments is the same as calling `[Symbol.iterator]()` one.
   *
   * @param accept  A function to push iterated elements to. Accepts iterated element as its only parameter. May return
   * `true` to suspend iteration, or `false` to stop it.
   *
   * @returns A push iterator instance to continue iteration with. If `accept` returned `false` then further iteration
   * won't be possible with returned iterator.
   */
  [PushIterator__symbol](accept?: PushIterator.Acceptor<T>): PushIterator<T>;

}

export namespace PushIterable {

  /**
   * A signature of function conforming to push iteration protocol.
   *
   * Used as `PushIterable[PushIterator__symbol]` method implementation when passed to {@link makePushIterable}
   * function.
   *
   * @typeParam T  Iterated elements type.
   */
  export type Iterate<T> =
  /**
   * @param accept  A function to push iterated elements to. Accepts iterated element as its only parameter. May return
   * `true` to suspend iteration, or `false` to stop it.
   *
   * @returns A push iterator instance to continue iteration with. If `accept` returned `false` then further iteration
   * won't be possible with returned iterator.
   */
      (this: void, accept?: PushIterator.Acceptor<T>) => PushIterator<T>;

}
