/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { isPushIterable, iteratorOf, pushIterated } from '../base';
import type { PushIterable } from '../push-iterable';

/**
 * Extracts the first element of the given `iterable`, if any.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to extract element from.
 *
 * @returns Either the first element, or `undefined` if the given `iterable` is empty.
 */
export function itsFirst<T>(iterable: Iterable<T>): T | undefined {
  if (isPushIterable(iterable)) {
    return pushedFirst(iterable);
  }

  const it = iteratorOf(iterable);

  return isPushIterable(it) ? pushedFirst(it) : rawFirst(it);
}

/**
 * @internal
 */
function pushedFirst<T>(it: PushIterable<T>): T | undefined {

  let first: T | undefined;

  pushIterated(
      it,
      element => {
        first = element;
        return false;
      },
  );

  return first;
}

/**
 * @internal
 */
function rawFirst<T>(it: Iterator<T>): T | undefined {

  const result = it.next();

  return result.done ? undefined : result.value;
}
