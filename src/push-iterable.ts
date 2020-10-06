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
   * Creates a {@link PushIterator push iterator} over elements of this iterable.
   *
   * Calling this method without arguments is the same as calling `[Symbol.iterator]()` one.
   *
   * @returns New push iterator instance.
   */
  [PushIterator__symbol](): PushIterator<T>;

  /**
   * Iterates over elements of this push iterable.
   *
   * Calls `accept` method for each iterated element until there are elements to iterate, or `accept` returned `false`.
   *
   * Calling this method is a faster alternative to creating a push iterator and iterating with it.
   *
   * @param accept  A function to push iterated elements to. Accepts iterated element as its only parameter. May return
   * `false` to stop iteration.
   *
   * @returns `true` if there are more elements to iterate, or `false` otherwise. The former is possible only when
   * iteration stopped, i.e. `accept` returned `false`.
   */
  [PushIterator__symbol](accept: PushIterator.Acceptor<T>): boolean;

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
  export type Iterate<T> = (this: void, accept?: PushIterator.Acceptor<T>) => PushIterator<T> | boolean;

}
