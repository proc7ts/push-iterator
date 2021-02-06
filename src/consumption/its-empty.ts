import { isPushIterable, iteratorOf, pushIterated } from '../base';
import type { PushIterable } from '../push-iterable';

/**
 * Checks whether the given `iterable` is empty.
 *
 * @param iterable - An iterable or push iterable to check for elements.
 *
 * @returns `true` if the given iterable contains at least one element, or `false` otherwise.
 */
export function itsEmpty(iterable: Iterable<unknown>): boolean {
  if (isPushIterable(iterable)) {
    return pushedEmpty(iterable);
  }

  const it = iteratorOf(iterable);

  return isPushIterable(it) ? pushedEmpty(it) : !!it.next().done;
}

/**
 * @internal
 */
function pushedEmpty(it: PushIterable<unknown>): boolean {

  let isEmpty = true;

  pushIterated(it, _element /* Unused parameter to prevent deoptimization */ => isEmpty = false);

  return isEmpty;
}
