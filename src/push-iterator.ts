import type { PushIterable } from './push-iterable';
import type { transformIt } from './transformation';

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
   * Generator instance is passed to {@link iterateOver} function.
   *
   * Generator pushes generated elements by provided `push` function until there are no more elements, or the `push`
   * function call returned `true` or `false`.
   *
   * The internal `state` is specific to generator. It is `undefined` initially. It can be updated by passing an updated
   * state as second parameter to `push` function.
   *
   * If generator did not push any elements or returned `false`, the generation stops.
   *
   * @typeParam T - Iterated elements type.
   * @typeParam TState - Generator's internal state type.
   * @param push - Pushes the next generated value and optionally a new generator state. Returns `undefined` if more
   * elements accepted, `true` to suspend generation, or `false` to stop it.
   * @param state - Either previous generator state, or `undefined` if generation just started.
   *
   * @returns `false` to stop generation, or anything else to go on.
   */
  export type Generator<T, TState = void> = (
      this: void,
      push: (this: void, next: T, newState?: TState) => boolean | void,
      state?: TState,
  ) => boolean | void;

  /**
   * Iterated elements transformer signature.
   *
   * Transformer instance is passed to {@link transformIt} function.
   *
   * Transformer pushes converted elements by provided `push` function until there are no more elements, or the `push`
   * function call returned `true` or `false`.
   *
   * The internal `state` is specific to transformer. It is `undefined` initially. It can be updated by passing an
   * updated state as second parameter to `push` function.
   *
   * If transformer returned `false`, the transformation stops. If transformer returned `true`, the same element is
   * transformed again.
   *
   * @typeParam TSrc - A type of source elements.
   * @typeParam TConv - A type of converted elements.
   * @typeParam TState - Transformer's internal state type.
   * @param push - Pushes the next converted value and optionally a new transformer state. Returns `undefined` if more
   * elements accepted, `true` to suspend generation, or `false` to stop it.
   * @param state - Either previous transformer state, or `undefined` if transformation just started.
   *
   * @returns `false` to stop transformation, special value {@link transformIt} to transform the same element again,
   * or anything else for continue transformation from the next element.
   */
  export type Transformer<TSrc, TConv = TSrc, TState = void> = (
      this: void,
      push: (this: void, next: TConv, state?: TState) => boolean | void,
      src: TSrc,
      state?: TState,
  ) => boolean | typeof transformIt | void;

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
