/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushOrRawIterable } from '../push-iterable';
import { iteratorOf } from '../push-iterator.impl';

/**
 * Extracts the first element of the given `iterable`, if any.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to extract element from.
 *
 * @return Either the first element, or `undefined` if the given `iterable` is empty.
 */
export function itsFirst<T>(iterable: PushOrRawIterable<T>): T | undefined {

  const it = iteratorOf(iterable);
  const forNext = it.forNext;

  if (forNext) {

    let first: T | undefined;

    forNext(element => {
      first = element;
      return false;
    });

    return first;
  }

  const result = it.next();

  return result.done ? undefined : result.value;
}
