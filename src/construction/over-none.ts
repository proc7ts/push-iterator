/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { emptyPushIterator } from '../base/make-push-iterator';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Returns a {@link PushIterator | push iterable iterator} without elements.
 *
 * @typeParam T - Iterated elements type.
 *
 * @returns Empty push iterable and push iterator instance.
 */
export function overNone<T>(): PushIterable<T> & PushIterator<T> {
  return emptyPushIterator;
}
