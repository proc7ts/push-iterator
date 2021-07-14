import type { PushIterator } from '../push-iterator';

export function PushIterator$iterator<T>(this: T): T {
  return this;
}

export function PushIterator$noNext<T>(): IteratorReturnResult<T> {
  return { done: true } as IteratorReturnResult<T>;
}

export function PushIterator$dontIterate<T>(
    _accept?: PushIterator.Acceptor<T>, // unused parameter to prevent deoptimization
): void {
  /* do not iterate */
}
