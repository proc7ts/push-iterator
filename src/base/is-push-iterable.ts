/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';

/**
 * Checks whether the given iterable or iterator conforms to {@link PushIterable push iteration protocol}.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable value to check.
 *
 * @returns `true` if `value` has a {@link PushIterator__symbol [PushIterator__symbol]} property, or `false` otherwise.
 */
export function isPushIterable<T>(iterable: Iterable<T> | Iterator<T>): iterable is PushIterable<T> {
  return !!(iterable as any)[PushIterator__symbol];
}
