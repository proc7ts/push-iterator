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
export function PushIterator$iterate<T>(this: PushIterator<T>): PushIterator<T>;

/**
 * @internal
 */
export function PushIterator$iterate<T>(this: PushIterator<T>, accept: PushIterator.Acceptor<T>): boolean;

/**
 * @internal
 */
export function PushIterator$iterate<T>(
    this: PushIterator<T>,
    accept?: PushIterator.Acceptor<T>,
): PushIterator<T> | boolean {
  return accept ? this.forNext(accept) : this;
}
