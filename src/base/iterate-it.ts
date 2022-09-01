import { PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';
import { arrayLike$process, arrayLike$some } from './array-like.impl';
import { isPushIterable } from './index';
import { iterable$process } from './iterable.impl';
import { iterator$convert, iterator$pusher } from './iterator.impl';
import { PushIterator$empty } from './push-iterator.empty.impl';

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
 * @param mode - Optional iteration mode hint declaring what `accept` function shall do.
 *
 * @returns A push iterator instance representing the tail of the given iterable. This iterator can be used to continue
 * iteration with, unless `accept` returned `false`. In the latter case the further iteration won't be possible.
 */
export function iterateIt<T>(
  iterable: Iterable<T>,
  accept: PushIterator.Acceptor<T>,
  mode: PushIterationMode = PushIterationMode.Some,
): PushIterator<T> {
  if (isPushIterable(iterable)) {
    return iterable[PushIterator__symbol](accept, mode);
  }
  if (Array.isArray(iterable)) {
    return iterateIt$array(iterable, accept, mode);
  }

  return iterateIt$raw(iterable, accept, mode);
}

function iterateIt$array<T>(
  array: readonly T[],
  accept: PushIterator.Acceptor<T>,
  mode: PushIterationMode,
): PushIterator<T> {
  return array.length
    ? mode > 0
      ? arrayLike$process(array, accept, mode)
      : arrayLike$some(array, accept)
    : PushIterator$empty;
}

function iterateIt$raw<T>(
  iterable: Iterable<T>,
  accept: PushIterator.Acceptor<T>,
  mode: PushIterationMode,
): PushIterator<T> {
  if (mode > 0) {
    return iterable$process(iterable, accept, mode);
  }

  const it = iterable[Symbol.iterator]();

  if (isPushIterable(it)) {
    return it[PushIterator__symbol](accept, mode);
  }

  const forEach = iterator$pusher(it);

  return forEach(accept) ? iterator$convert(it, forEach) : PushIterator$empty;
}
