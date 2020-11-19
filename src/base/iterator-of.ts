/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a push iterator over elements of the given push `iterable`.
 *
 * Calls `iterable[Symbol.iterator]()` and returns its result.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - A push iterable to construct iterator of.
 *
 * @returns Push iterator.
 */
export function iteratorOf<T>(iterable: PushIterable<T>): PushIterator<T>;

/**
 * Creates an iterable iterator over elements of the given `iterable` supporting iterable iteration.
 *
 * Calls `iterable[Symbol.iterator]()` and returns its result.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - A push iterable to construct iterator of.
 *
 * @returns Iterable iterator.
 */
export function iteratorOf<T>(iterable: { [Symbol.iterator](): IterableIterator<T> }): IterableIterator<T>;

/**
 * Creates iterator over elements of the given `iterable`.
 *
 * Calls `iterable[Symbol.iterator]()` and returns its result.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable to construct iterator of.
 *
 * @returns Either push or raw iterator.
 */
export function iteratorOf<T>(iterable: Iterable<T>): Iterator<T>;

export function iteratorOf<T>(iterable: Iterable<T>): Iterator<T> {
  return iterable[Symbol.iterator]();
}
