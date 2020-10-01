/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterator, PushOrRawIterator } from './push-iterator';

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

/**
 * Either {@link PushIterable push} iterable or raw one.
 *
 * Functions of this library works with both iterable types.
 *
 * @typeParam T  Iterated elements type.
 */
export type PushOrRawIterable<T> = PushIterable<T> | {
  [Symbol.iterator](): PushOrRawIterator<T>;
};
