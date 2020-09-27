/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterable } from '../push-iterable';
import { PushIterator } from '../push-iterator';

/**
 * @internal
 */
const noneIterator = {
  [Symbol.iterator]: () => noneIterator,
  next: () => ({ done: true } as IteratorReturnResult<unknown>),
  forNext: () => false,
};

/**
 * Returns a {@link PushIterator push iterable iterator} without elements.
 *
 * @typeParam T  Iterated elements type.
 * @typeparam T  A type of constructed iterable elements.
 *
 * @returns Empty push iterable and push iterator instance.
 */
export function overNone<T>(): PushIterable<T> & PushIterator<T> {
  return noneIterator;
}
