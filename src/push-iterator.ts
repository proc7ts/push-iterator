/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from './push-iterable';

/**
 * Iterator implementing push iteration protocol.
 *
 * @typeParam T  Iterated elements type.
 */
export interface PushIterator<T> extends IterableIterator<T>, PushIterable<T> {

  [Symbol.iterator](): PushIterator<T>;

}

export namespace PushIterator {

  /**
   * A signature of iterated elements pusher function conforming to push iteration protocol.
   *
   * @typeParam T  Iterated elements type.
   */
  export type Pusher<T> =
  /**
   * @param accept  A function to push iterated elements to. Accepts iterated element as its only parameter. May return
   * `false` to stop iteration.
   *
   * @returns `true` if further iteration is possible, or `false` if there is no more elements left to iterate.
   * The former is possible only when iteration stopped, i.e. `accept` returned `false`.
   */
      (this: void, accept: Acceptor<T>) => boolean;

  /**
   * A signature of a function accepting iterated elements.
   *
   * It is able to prevent further iteration by returning `false`.
   *
   * @typeParam T  Iterated elements type.
   */
  export type Acceptor<T> = EachAcceptor<T> | StoppingAcceptor<T>;

  /**
   * A signature of a function accepting each iterated element unconditionally.
   *
   * @typeParam T  Iterated elements type.
   */
  export type EachAcceptor<T> =
  /**
   * @param element  Iterated element.
   */
      (this: void, element: T) => void;

  /**
   * A signature of a function accepting iterated elements and able to prevent further iteration.
   *
   * @typeParam T  Iterated elements type.
   */
  export type StoppingAcceptor<T> =
  /**
   * @param element  Iterated element.
   *
   * @returns `false` to prevent further iteration. No more element will be pushed to acceptor after that.
   */
      (this: void, element: T) => boolean;

}

