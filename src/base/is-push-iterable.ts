/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Checks whether the given iterable conforms to {@link PushIterable | push iteration protocol}.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable to check.
 *
 * @returns `true` if the given `iterable` has a {@link PushIterator__symbol [PushIterator__symbol]} property,
 * or `false` otherwise.
 */
export function isPushIterable<T>(iterable: Iterable<T>): iterable is PushIterable<T>;

/**
 * Checks whether the given iterator conforms to {@link PushIterable | push iteration protocol}.
 *
 * @typeParam T - Iterated elements type.
 * @param iterator - An iterator to check.
 *
 * @returns `true` if the given `iterator` has a {@link PushIterator__symbol | [PushIterator__symbol]} property,
 * or `false` otherwise.
 */
export function isPushIterable<T>(iterator: Iterator<T>): iterator is PushIterator<T>;

export function isPushIterable<T>(iterable: Iterable<T> | Iterator<T>): iterable is PushIterator<T> {
  return !!(iterable as Partial<PushIterable<T>>)[PushIterator__symbol];
}
