/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

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
 *
 * @returns Empty push iterable and push iterator instance.
 */
export function overNone<T>(): PushIterable<T> & PushIterator<T> {
  return noneIterator;
}
