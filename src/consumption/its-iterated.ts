/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { isPushIterable, iteratorOf, pushIterated } from '../base';
import type { PushIterator } from '../push-iterator';

/**
 * Iterates over elements of the given iterable.
 *
 * Calls `accept` method for each iterated element until there are elements to iterate, or `accept` returned `false`.
 *
 * In contrast to {@link pushIterated} function, this one accepts any iterable instance.
 *
 * @param iterable  A push iterable to iterate elements of.
 * @param accept  A function to push iterated elements to. Accepts iterated element as its only parameter. May return
 * `false` to stop iteration.
 *
 * @returns `true` if there are more elements to iterate, or `false` otherwise. The former is possible only when
 * iteration suspended or stopped, i.e. `accept` returned `true` or `false`.
 */
export function itsIterated<T>(iterable: Iterable<T>, accept: PushIterator.Acceptor<T>): boolean {
  if (isPushIterable(iterable)) {
    return pushIterated(iterable, accept);
  }

  const it = iteratorOf(iterable);

  if (isPushIterable(it)) {
    return pushIterated(it, accept);
  }

  for (; ;) {

    const next = it.next();

    if (next.done) {
      return false;
    }

    const status = accept(next.value);

    if (status === true || status === false) {
      return status;
    }
  }
}
