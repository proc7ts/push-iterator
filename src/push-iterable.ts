/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterator } from './push-iterator';

/**
 * An iterable implementing push iteration protocol.
 *
 * @typeParam T  Iterated elements type.
 */
export interface PushIterable<T> extends Iterable<T> {

  /**
   * Builds push iterator over elements of this iterable.
   *
   * @returns New push iterator instance.
   */
  [Symbol.iterator](): PushIterator<T>;

}
