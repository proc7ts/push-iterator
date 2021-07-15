import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { isPushIterable } from './index';
import { iterateOverArray } from './iterate-over-array.impl';
import { PushIterator$empty } from './push-iterator.empty.impl';
import { rawIteratorPusher, toPushIterator } from './push-iterator.raw.impl';

/**
 * Iterates over elements of the given iterable.
 *
 * Calls `accept` method for each iterated element until there are elements to iterate, or `accept` returned either
 * `true` or `false`.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable to iterate elements of.
 * @param accept - A function to push iterated elements to. Accepts iterated element as its only parameter. May return
 * `true` to suspend iteration, or `false` to stop it.
 *
 * @returns A push iterator instance representing the tail of the given iterable. This iterator can be used to continue
 * iteration with, unless `accept` returned `false`. In the latter case the further iteration won't be possible.
 */
export function iterateIt<T>(iterable: Iterable<T>, accept: PushIterator.Acceptor<T>): PushIterator<T> {
  if (isPushIterable(iterable)) {
    return iterable[PushIterator__symbol](accept);
  }
  if (Array.isArray(iterable)) {
    return iterateIt$array(iterable, accept);
  }

  return iterateIt$raw(iterable, accept);
}

function iterateIt$array<T>(array: ArrayLike<T>, accept: PushIterator.Acceptor<T>): PushIterator<T> {
  return array.length ? iterateOverArray(array)(accept) : PushIterator$empty;
}

function iterateIt$raw<T>(
    iterable: Iterable<T>,
    accept: PushIterator.Acceptor<T>,
): PushIterator<T> {

  const it = iterable[Symbol.iterator]();

  if (isPushIterable(it)) {
    return it[PushIterator__symbol](accept);
  }

  const forEach = rawIteratorPusher(it);

  return forEach(accept) ? toPushIterator(it, forEach) : PushIterator$empty;
}
