/**
 * Push iteration mode.
 *
 * This is a hint passed as second argument of {@link PushIterator__symbol} method. It declares what
 * {@link PushIterator.Acceptor element acceptor} shall do, and can be used to optimize the iteration algorithm.
 */
export const enum PushIterationMode {
  /**
   * Push the next element if exists, then suspend or abort.
   *
   * This value is typically set in compatibility mode. I.e. when standard iterator used to iterate over push iterator.
   */
  Next = 1,

  /**
   * Push some elements. Iteration may be suspended or aborted at any moment.
   *
   * This iteration mode is used by default.
   */
  Some = 0,

  /**
   * Push only some subset of elements, then abort iteration.
   *
   * The {@link PushIterator.Acceptor element acceptor} shall not suspend iteration by returning `true` value in this
   * mode.
   */
  Only = 1,

  /**
   * Push all elements.
   *
   * The {@link PushIterator.Acceptor element acceptor} shall not suspend or abort iteration by returning boolean value
   * in this mode.
   */
  All = 2,
}
