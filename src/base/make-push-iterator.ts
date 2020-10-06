/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a push iterator implementation.
 *
 * @param forNext  A function iterating over elements conforming to push iteration protocol.
 *
 * @returns New push iterator instance performing iteration by `forNext` function.
 */
export function makePushIterator<T>(forNext: PushIterator.Pusher<T>): PushIterator<T> {
  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol]: PushIterator$iterate(forNext),
    next: PushIterator$next,
  };
}

/**
 * @internal
 */
export function PushIterator$iterator<T>(this: T): T {
  return this;
}

/**
 * @internal
 */
export function PushIterator$next<T>(this: PushIterator<T>): IteratorResult<T> {
  for (; ;) {

    let result: IteratorYieldResult<T> | undefined;
    const done = !this[PushIterator__symbol](value => {
      result = { value };
      return false;
    });

    if (result) {
      return result;
    }
    if (done) {
      return { done: true } as IteratorReturnResult<T>;
    }
  }
}

/**
 * @internal
 */
type PushIterable$iterate<T> = {
  (): PushIterator<T>;
  (accept: PushIterator.Acceptor<T>): boolean;
};

/**
 * @internal
 */
export function PushIterator$iterate<T>(forNext: PushIterator.Pusher<T>): PushIterable$iterate<T> {
  return ((accept?: PushIterator.Acceptor<T>) => accept
      ? forNext(accept)
      : makePushIterator(forNext)) as PushIterable$iterate<T>;
}
