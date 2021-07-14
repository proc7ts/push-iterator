import { isPushIterable, iteratorOf } from '../base';
import { iterateRaw } from '../base/iterate-raw.impl';
import type { PushIterator } from '../push-iterator';

/**
 * Starts iteration over the given `iterable`.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable or push iterable to iterate over.
 *
 * @returns A push iterator iterating over the given iterable.
 */
export function itsIterator<T>(iterable: Iterable<T>): PushIterator<T> {

  const it = iteratorOf(iterable);

  return isPushIterable(it) ? it : iterateRaw(() => it);
}
