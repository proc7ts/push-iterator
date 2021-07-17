import { isPushIterable } from '../base';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';

/**
 * Checks whether the given `iterable` is empty.
 *
 * @param iterable - An iterable or push iterable to check for elements.
 *
 * @returns `true` if the given iterable contains at least one element, or `false` otherwise.
 */
export function itsEmpty(iterable: Iterable<unknown>): boolean {
  if (isPushIterable(iterable)) {
    return itsEmpty$(iterable);
  }

  const it = iterable[Symbol.iterator]();

  return isPushIterable(it)
      ? itsEmpty$(it)
      : !!it.next().done;
}

function itsEmpty$(it: PushIterable<unknown>): boolean {

  let isEmpty = true;

  it[PushIterator__symbol](_element => isEmpty = false, PushIterationMode.Only);

  return isEmpty;
}
