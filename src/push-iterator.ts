import type { PushIterable } from './push-iterable';

/**
 * Iterator implementing push iteration protocol.
 *
 * @typeParam T - Iterated elements type.
 */
export interface PushIterator<T> extends IterableIterator<T>, PushIterable<T> {

  [Symbol.iterator](): PushIterator<T>;

  /**
   * Checks whether iteration is over.
   *
   * @returns `true` is there is nothing to iterate any more, or `false` if iteration is still possible.
   */
  isOver(): boolean;

}

export namespace PushIterator {

  /**
   * A signature of iterated elements pusher function conforming to push iteration protocol.
   *
   * @typeParam T - Iterated elements type.
   */
  export type Pusher<T> =
  /**
   * @param accept - A function to push iterated elements to. Accepts iterated element as its only parameter. May return
   * `false` to stop iteration.
   *
   * @returns `true` if further iteration is possible, or `false` if there is no more elements left to iterate.
   * The former is possible only when iteration stopped, i.e. `accept` returned `false`.
   */
      (this: void, accept: Acceptor<T>) => boolean;

  /**
   * A signature of a function accepting iterated elements.
   *
   * It is able to suspend iteration by returning `true`, or to stop it by returning `false`.
   *
   * @typeParam T - Iterated elements type.
   */
  export type Acceptor<T> = EachAcceptor<T> | StoppingAcceptor<T>;

  /**
   * A signature of a function accepting each iterated element unconditionally.
   *
   * @typeParam T - Iterated elements type.
   */
  export type EachAcceptor<T> =
  /**
   * @param element - Iterated element.
   */
      (this: void, element: T) => void;

  /**
   * A signature of a function accepting iterated elements and able to suspend or stop further iteration.
   *
   * When this function returns `true`, the iteration is suspended. I.e. the no more elements would be pushed to this
   * function, but the iteration method (`[PushIterator__symbol]`) would return an iterator that can be used to resume
   * iteration.
   *
   * When this function returns `false`, the iteration is stopped. I.e. the no more elements would be pushed to this
   * function, and the iteration method (`[PushIterator__symbol]`) would return an empty iterator. I.e. the one with
   * its {@link PushIterator.isOver} method always returning `true`.
   *
   * @typeParam T - Iterated elements type.
   */
  export type StoppingAcceptor<T> =
  /**
   * @param element - Iterated element.
   *
   * @returns `true` to suspend iteration, or `false` to stop it.
   */
      (this: void, element: T) => boolean;

}
