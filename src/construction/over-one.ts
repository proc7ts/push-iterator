/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import { PushIterable__symbol } from '../push-iterable';
import { oneValueIterator } from '../push-iterator.impl';

/**
 * Creates a {@link PushIterable push iterable} over one value.
 *
 * @typeParam T  Iterated element value type.
 * @param value  A value to iterate over.
 *
 * @returns New push iterable over the given value.
 */
export function overOne<T>(value: T): PushIterable<T> {
  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]: () => oneValueIterator(value),
  };
}
