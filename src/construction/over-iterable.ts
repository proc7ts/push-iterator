/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import { isPushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator__symbol } from '../push-iterator';
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

  const iterate = (): PushIterator<T> => toPushIterator(source[Symbol.iterator]());

  return {
    [Symbol.iterator]: iterate,
    [PushIterator__symbol]: iterate,
  };
}
