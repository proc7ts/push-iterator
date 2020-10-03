/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import { isPushIterable, PushIterable__symbol } from '../push-iterable';
import { toPushIterator } from '../push-iterator.impl';
import { overArray } from './over-array';

/**
 * Creates a {@link PushIterable push iterable} over elements of the given raw iterable.
 *
 * @typeParam T  Iterated elements type.
 * @param source  Source iterable to iterate over elements of.
 *
 * @returns New push iterable over elements of the given `source`.
 */
export function overIterable<T>(source: PushOrRawIterable<T>): PushIterable<T> {
  if (isPushIterable(source)) {
    return source;
  }
  if (Array.isArray(source)) {
    return overArray<T>(source);
  }
  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]: () => toPushIterator(source[Symbol.iterator]()),
  };
}
