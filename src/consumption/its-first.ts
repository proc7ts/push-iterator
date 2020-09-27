/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import { PushIterator } from '../push-iterator';

/**
 * Extracts the first element of the given `iterable`, if any.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to extract element from.
 *
 * @return Either the first element, or `undefined` if the given `iterable` is empty.
 */
export function itsFirst<T>(iterable: Iterable<T> | PushIterable<T>): T | undefined {

  const it = iterable[Symbol.iterator]();

  if (PushIterator.is(it)) {

    let first: T | undefined;

    it.forNext(element => {
      first = element;
      return false;
    });

    return first;
  }

  const result = it.next();

  return result.done ? undefined : result.value;
}
