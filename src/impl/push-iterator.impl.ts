import { makePushIterator } from '../base';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

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
