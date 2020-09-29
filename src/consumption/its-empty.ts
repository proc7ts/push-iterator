/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { isPushIterator } from '../is-push-iterator';
import type { PushIterable } from '../push-iterable';
import { itsIterator } from '../push-iterator';

/**
 * Checks whether the given `iterable` is empty.
 *
 * @param iterable  An iterable or push iterable to check for elements.
 *
 * @return `true` if the given iterable contains at least one element, or `false` otherwise.
 */
export function itsEmpty(iterable: Iterable<any> | PushIterable<any>): boolean {

  const it = iterable[Symbol.iterator]();

  if (isPushIterator(it)) {

    let isEmpty = true;

    itsIterator(iterable).forNext(() => isEmpty = false);

    return isEmpty;
  }

  return !!it.next().done;
}
