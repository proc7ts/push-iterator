/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';
import type { PushIterator } from '../push-iterator';

/**
 * Extracts the first element of the given `iterable`, if any.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to extract element from.
 *
 * @return Either the first element, or `undefined` if the given `iterable` is empty.
 */
export function itsFirst<T>(iterable: Iterable<T>): T | undefined {

  const it = iteratorOf(iterable);

  return it.forNext ? pushedFirst(it) : rawFirst(it);
}

/**
 * @internal
 */
function pushedFirst<T>(it: PushIterator<T>): T | undefined {

  let first: T | undefined;

  it.forNext(element => {
    first = element;
    return false;
  });

  return first;
}

/**
 * @internal
 */
function rawFirst<T>(it: Iterator<T>): T | undefined {

  const result = it.next();

  return result.done ? undefined : result.value;
}
