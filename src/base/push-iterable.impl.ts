import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * @internal
 */
export function PushIterable$iterator<T>(this: PushIterable<T>): PushIterator<T> {
  return this[PushIterator__symbol]();
}
