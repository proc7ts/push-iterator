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

  return it.forNext ? pushedEmpty(it) : !!it.next().done;
}

/**
 * @internal
 */
function pushedEmpty<T>(it: PushIterator<T>): boolean {

  let isEmpty = true;

  it.forNext(() => isEmpty = false);

  return isEmpty;
}
