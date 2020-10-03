/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterator, PushOrRawIterator } from './push-iterator';

/**
 * A key of {@link PushIterable} marker property.
 */
export const PushIterable__symbol = (/*#__PURE__*/ Symbol('push-iterable'));

/**
 * An iterable implementing push iteration protocol.
 *
 * @typeParam T  Iterated elements type.
 */
export interface PushIterable<T> extends Iterable<T> {

  /**
   * A push iterable marker property.
   *
   * When contains a truthy value `[Symbol.iterator]()` method should return a {@link PushIterator} instance.
   */
  [PushIterable__symbol]: unknown;

  /**
   * Creates a {@link PushIterator push iterator} over elements of this iterable.
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
  [PushIterable__symbol]?: undefined;
  [Symbol.iterator](): PushOrRawIterator<T>;
};

/**
 * Checks whether the given iterable implements a {@link PushIterable push iteration protocol}.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to check.
 *
 * @returns `true` if the given `iterable` has a {@link PushIterable__symbol} property set to truthy value,
 * or `false` otherwise.
 */
export function isPushIterable<T>(iterable: PushOrRawIterable<T>): iterable is PushIterable<T> {
  return !!iterable[PushIterable__symbol];
}
