import { PushIterator$empty } from '../base/push-iterator.empty.impl';
import type { PushIterable } from '../push-iterable';
import { flatMapArray$, flatMapArray$defaultElementOf } from '../transformation/flat-map-array.impl';
import { overIterable } from './over-iterable';

/**
 * Creates a {@link PushIterable | push iterable} over elements of other iterables.
 *
 * @typeParam T - Iterated elements type.
 * @param sources - Source iterables to iterate over elements of.
 *
 * @returns New push iterable over elements of the given `sources`.
 */
export function overElementsOf<T>(...sources: readonly Iterable<T>[]): PushIterable<T> {
  return sources.length > 1
      ? flatMapArray$<Iterable<T>, T>(sources, flatMapArray$defaultElementOf)
      : (sources.length ? overIterable(sources[0]) : PushIterator$empty);
}
