import { isPushIterable } from '../base';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';

/**
 * Extracts the first element of the given `iterable`, if any.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable to extract element from.
 *
 * @returns Either the first element, or `undefined` if the given `iterable` is empty.
 */
export function itsFirst<T>(iterable: Iterable<T>): T | undefined {
  if (isPushIterable(iterable)) {
    return itsFirst$(iterable);
  }

  const it = iterable[Symbol.iterator]();

  return isPushIterable(it) ? itsFirst$(it) : itsFirst$raw(it);
}

function itsFirst$<T>(it: PushIterable<T>): T | undefined {

  let first: T | undefined;

  it[PushIterator__symbol](
      element => {
        first = element;
        return false;
      },
      PushIterationMode.Only,
  );

  return first;
}

function itsFirst$raw<T>(it: Iterator<T>): T | undefined {

  const result = it.next();

  return result.done ? undefined : result.value;
}
