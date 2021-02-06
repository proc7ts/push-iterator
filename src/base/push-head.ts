import { PushIterable, PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Iterates over the head elements of the given push iterable.
 *
 * Calls `accept` method for each iterated element until there are elements to iterate, or `accept` returned either
 * `true` or `false`.
 *
 * Calling this function is the same as calling `iterable[PushIterator__symbol](accept)`.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - A push iterable to iterate elements of.
 * @param accept - A function to push iterated elements to. Accepts iterated element as its only parameter. May return
 * `true` to suspend iteration, or `false` to stop it.
 *
 * @returns A push iterator instance representing the tail of the given iterable. This iterator can be used to continue
 * iteration with, unless `accept` returned `false`. In the latter case the further iteration won't be possible.
 */
export function pushHead<T>(iterable: PushIterable<T>, accept: PushIterator.Acceptor<T>): PushIterator<T> {
  return iterable[PushIterator__symbol](accept);
}
