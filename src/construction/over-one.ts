/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { oneValueIterator } from '../impl';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable push iterable} over one value.
 *
 * @typeParam T  Iterated element value type.
 * @param value  A value to iterate over.
 *
 * @returns New push iterable over the given value.
 */
export function overOne<T>(value: T): PushIterable<T> {
  return { [Symbol.iterator]: () => oneValueIterator(value) };
}
