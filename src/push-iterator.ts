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
   * Iterated elements generator signature.
   *
   * Generator instance is passed to {@link iterateOver} method.
   *
   * Generator has to push generated elements with provided `push` function until there are no more elements, or the
   * `push` function call returned `true` or `false`. The second `push` function parameter is an updated internal state
   * instance, which is required to continue generation.
   *
   * The internal `state` is specific to generator. It is `undefined` initially. It has to be updated on each `push`
   * call by passing an updated state as second parameter. Updating to `null` or `undefined` stops generation.
   *
   * If generator did not `push` any elements, generation stops.
   *
   * @typeParam T - Iterated elements type.
   * @typeParam TState - Internal state of generator.
   * @param push - Pushes the next generated value and a new generator state. Returns `undefined` if more elements
   * accepted, `true` to suspend generation, or `false` to stop it.
   * @param state - Either previous generator state, or `undefined` if generation just started.
   */
  export type Generator<T, TState> = (
      this: void,
      push: (this: void, next: T, newState?: TState | null) => boolean | void,
      state?: TState,
  ) => void;

  /**
   * A signature of iterated elements pusher function conforming to push iteration protocol.
   *
   * @typeParam T - Iterated elements type.
   * @param accept - A function to push iterated elements to. Accepts iterated element as its only parameter. May return
   * `false` to stop iteration.
   *
   * @returns `true` if further iteration is possible, or `false` if there is no more elements left to iterate.
   * The former is possible only when iteration stopped, i.e. `accept` returned `false`.
   */
  export type Pusher<T> = (this: void, accept: Acceptor<T>) => boolean;

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
   * @param element - Iterated element.
   */
  export type EachAcceptor<T> = (this: void, element: T) => void;

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
   * @param element - Iterated element.
   *
   * @returns `true` to suspend iteration, or `false` to stop it.
   */
  export type StoppingAcceptor<T> = (this: void, element: T) => boolean;

}
