/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterator$iterator } from '../base/make-push-iterator';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * @internal
 */
const noneIterator: PushIterator<any> & PushIterable<any> = {
  [Symbol.iterator]: PushIterator$iterator,
  [PushIterator__symbol](accept?: PushIterator.Acceptor<any>) {
    return (accept ? false : this) as any;
  },
  next: () => ({ done: true } as IteratorReturnResult<unknown>),
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
