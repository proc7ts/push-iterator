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
   * Generator instance is passed to {@link iterateGenerated} function.
   *
   * Generator pushes generated elements by provided `push` function until there are no more elements, or the `push`
   * function call returned `true` or `false`.
   *
   * The internal `state` is specific to generator. It is `undefined` initially. An updated state can be returned from
   * generator. It will be passed to generator next time it is called.
   *
   * If generator did not push any elements or returned `false`, the generation stops.
   *
   * @typeParam T - Iterated elements type.
   * @typeParam TState - Generator's internal state type.
   * @param push - Pushes the next generated value. Returns `undefined` if more elements accepted, `true` to suspend
   * generation, or `false` to stop it.
   * @param state - Either previous generator state, or `undefined` if generation just started.
   *
   * @returns `false` to stop generation, or updated to continue generation.
   */
  export type Generator<T, TState = void> = (
      this: void,
      push: (this: void, next: T) => boolean | void,
      state?: TState,
  ) => TState | false;

  /**
   * Iterated elements transformer signature.
   *
   * Transformer instance is passed to {@link transformIt} function.
   *
   * Transformer pushes converted elements by provided `push` function until there are no more elements, or the `push`
   * function call returned `true` or `false`.
   *
   * The internal `state` is specific to transformer. It is `undefined` initially. An updated state can be returned from
   * transformer. It will be passed to transformer next time it is called.
   *
   * If transformer did not push any converted values or returned `false`, the transformation stops. If transformer
   * returned state with {@link TransformState.re re} flag set, the same element will be transformed again.
   *
   * @typeParam TSrc - A type of source elements.
   * @typeParam TConv - A type of converted elements.
   * @typeParam TState - Transformer's internal state type.
   * @param push - Pushes the next converted value. Returns `undefined` if more elements accepted, `true` to suspend
   * generation, or `false` to stop it.
   * @param state - Either previous transformer state, or `undefined` if transformation just started.
   *
   * @returns `false` to stop transformation, special value {@link transformIt} to transform the same element again,
   * or anything else for continue transformation from the next element.
   */
  export type Transformer<TSrc, TConv = TSrc, TState = void> = (
      this: void,
      push: (this: void, next: TConv) => boolean | void,
      src: TSrc,
      state?: TState,
  ) => TState | false;

  /**
   * Transformer state indicating whether the same element should be transformed again.
   */
  export interface TransformState {

    /**
     * When `true` the same element will be transformed again.
     */
    readonly re?: boolean;

  }

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
