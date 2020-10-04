/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushOrRawIterable } from '../push-iterable';
import { iteratorOf } from '../push-iterator.impl';

/**
 * Checks whether the given `iterable` is empty.
 *
 * @param iterable  An iterable or push iterable to check for elements.
 *
 * @return `true` if the given iterable contains at least one element, or `false` otherwise.
 */
export function itsEmpty(iterable: PushOrRawIterable<any>): boolean {

  const it = iteratorOf(iterable);
  const forNext = it.forNext;

  if (forNext) {

    let isEmpty = true;

    forNext(() => isEmpty = false);

    return isEmpty;
  }

  return !!it.next().done;
}
