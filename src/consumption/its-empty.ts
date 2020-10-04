/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';
import type { PushIterator } from '../push-iterator';

/**
 * Checks whether the given `iterable` is empty.
 *
 * @param iterable  An iterable or push iterable to check for elements.
 *
 * @return `true` if the given iterable contains at least one element, or `false` otherwise.
 */
export function itsEmpty(iterable: Iterable<any>): boolean {

  const it = iteratorOf(iterable);
  const forNext = it.forNext;

  return forNext ? pushedEmpty(forNext) : !!it.next().done;
}

/**
 * @internal
 */
function pushedEmpty<T>(forNext: PushIterator.Pusher<T>): boolean {

  let isEmpty = true;

  forNext(() => isEmpty = false);

  return isEmpty;
}
