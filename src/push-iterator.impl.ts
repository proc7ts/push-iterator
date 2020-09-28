import type { PushIterator } from './push-iterator';

/**
 * @internal
 */
function PushIterator$iterator<T>(this: PushIterator<T>): PushIterator<T> {
  return this;
}

/**
 * @internal
 */
function PushIterator$next<T>(this: PushIterator<T>): IteratorResult<T> {
  for (; ;) {

    let result: IteratorYieldResult<T> | undefined;
    const done = !this.forNext(value => {
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
export function pushIteratorBy<T>(forNext: PushIterator<T>['forNext']): PushIterator<T> {
  return {
    [Symbol.iterator]: PushIterator$iterator,
    next: PushIterator$next,
    forNext,
  };
}
