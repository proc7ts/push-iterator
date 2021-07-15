import { PushIterator$empty } from '../base/push-iterator.empty.impl';
import type { PushIterator } from '../push-iterator';

/**
 * Returns a {@link PushIterator push iterator} without elements.
 *
 * @typeParam T - Iterated elements type.
 *
 * @returns Empty push iterator instance.
 */
export function overNone<T>(): PushIterator<T> {
  return PushIterator$empty;
}
