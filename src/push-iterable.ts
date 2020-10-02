/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterator, PushOrRawIterator } from './push-iterator';
import { PushIterator__symbol } from './push-iterator';

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
   * This is an alias of `[Symbol.iterator]` method used as a marker.
   *
   * Note that this method does not require `this` context and can be called as a function.
   *
   * @returns New push iterator instance.
   */
  [PushIterator__symbol](this: void): PushIterator<T>;

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
  [PushIterator__symbol]?: undefined;
};

/**
 * Checks whether the given iterable implements a {@link PushIterable push iteration protocol}.
 *
 * It could be more efficient to get a `iterable[PushIterator__symbol]` instead. The latter can be called as a method
 * when present.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to check.
 *
 * @returns `true` if the given `iterable` has a {@link PushIterator__symbol} property, or `false` otherwise.
 */
export function isPushIterable<T>(iterable: PushOrRawIterable<T>): iterable is PushIterable<T> {
  return !!iterable[PushIterator__symbol];
}
