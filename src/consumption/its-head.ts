/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { isPushIterable, iteratorOf, pushHead } from '../base';
import { iterateOverArray } from '../base/array-iterator.impl';
import { rawIteratorPusher, toPushIterator } from '../base/raw-iterator.impl';
import { overNone } from '../construction';
import type { PushIterator } from '../push-iterator';

/**
 * Iterates over elements of the given iterable.
 *
 * Calls `accept` method for each iterated element until there are elements to iterate, or `accept` returned either
 * `true` or `false`.
 *
 * In contrast to {@link pushHead} function, this one accepts any iterable instance.
 *
 * @param iterable  An iterable to iterate elements of.
 * @param accept  A function to push iterated elements to. Accepts iterated element as its only parameter. May return
 * `true` to suspend iteration, or `false` to stop it.
 *
 * @returns A push iterator instance representing the tail of the given iterable. This iterator can be used to continue
 * iteration with, unless `accept` returned `false`. In the latter case the further iteration won't be possible.
 */
export function itsHead<T>(iterable: Iterable<T>, accept: PushIterator.Acceptor<T>): PushIterator<T> {
  if (isPushIterable(iterable)) {
    return pushHead(iterable, accept);
  }
  if (Array.isArray(iterable)) {
    return arrayHead(iterable, accept);
  }
  return rawIterableHead(iterable, accept);
}

/**
 * @internal
 */
function arrayHead<T>(array: ArrayLike<T>, accept: PushIterator.Acceptor<T>): PushIterator<T> {
  return array.length ? iterateOverArray(array)(accept) : overNone();
}

/**
 * @internal
 */
function rawIterableHead<T>(
    iterable: Iterable<T>,
    accept: PushIterator.Acceptor<T>,
): PushIterator<T> {

  const it = iteratorOf(iterable);
  const forEach = rawIteratorPusher(it);

  return forEach(accept) ? toPushIterator(it, forEach) : overNone();
}

