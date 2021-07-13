import type { PushIterator } from '../push-iterator';
import { pushIterated } from './push-iterated';

export function PushIterator$iterator<T>(this: T): T {
  return this;
}

export function PushIterator$next<T>(this: PushIterator<T>): IteratorResult<T> {
  for (; ;) {

    let result: IteratorYieldResult<T> | undefined;
    const over = !pushIterated(
        this,
        value => {
          result = { value };
          return true;
        },
    );

    if (result) {
      return result;
    }
    if (over) {
      return { done: true } as IteratorReturnResult<T>;
    }
  }
}

export function PushIterator$noNext<T>(): IteratorReturnResult<T> {
  return { done: true } as IteratorReturnResult<T>;
}

export function PushIterator$dontIterate<T>(
    _accept?: PushIterator.Acceptor<T>, // unused parameter to prevent deoptimization
): void {
  /* do not iterate */
}
