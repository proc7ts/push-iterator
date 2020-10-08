/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterable, PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Iterates over elements of the given push iterable.
 *
 * Calls `accept` method for each iterated element until there are elements to iterate, or `accept` returned `false`.
 *
 * Calling this function is the same as calling `!iterable[PushIterator__symbol](accept).isOver()`.
 *
 * @param iterable  A push iterable to iterate elements of.
 * @param accept  A function to push iterated elements to. Accepts iterated element as its only parameter. May return
 * `false` to stop iteration.
 *
 * @returns `true` if there are more elements to iterate, or `false` otherwise. The former is possible only when
 * iteration suspended or stopped, i.e. `accept` returned `true` or `false`.
 */
export function pushIterated<T>(iterable: PushIterable<T>, accept: PushIterator.Acceptor<T>): boolean {
  return !iterable[PushIterator__symbol](accept).isOver();
}
