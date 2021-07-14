import type { PushIterator } from '../push-iterator';
import { isPushIterable } from './is-push-iterable';
import { iterateArray } from './iterate-array.impl';
import { iteratorOf } from './iterator-of';
import { pushHead } from './push-head';
import { PushIterator$empty } from './push-iterator.empty.impl';
import { rawIteratorPusher, toPushIterator } from './raw-iterator.impl';

/**
 * Iterates over elements of the given iterable.
 *
 * Calls `accept` method for each iterated element until there are elements to iterate, or `accept` returned either
 * `true` or `false`.
 *
 * In contrast to {@link pushHead} function, this one accepts any iterable instance.
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
    return pushHead(iterable, accept);
  }
  if (Array.isArray(iterable)) {
    return arrayHead(iterable, accept);
  }
  return rawIterableHead(iterable, accept);
}

function arrayHead<T>(array: ArrayLike<T>, accept: PushIterator.Acceptor<T>): PushIterator<T> {
  return array.length ? iterateArray(array, accept) : PushIterator$empty;
}

function rawIterableHead<T>(
    iterable: Iterable<T>,
    accept: PushIterator.Acceptor<T>,
): PushIterator<T> {

  const it = iteratorOf(iterable);

  if (isPushIterable(it)) {
    return pushHead(it, accept);
  }

  const forEach = rawIteratorPusher(it);

  return forEach(accept) ? toPushIterator(it, forEach) : PushIterator$empty;
}
