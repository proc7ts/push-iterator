/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { PushIterable, PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { pushIterated } from './push-iterated';

/**
 * Creates a push iterator implementation.
 *
 * @typeParam T - Iterated elements type.
 * @param forNext - A function iterating over elements conforming to push iteration protocol.
 *
 * @returns New push iterator instance performing iteration by `forNext` function.
 */
export function makePushIterator<T>(forNext: PushIterator.Pusher<T>): PushIterator<T> {

  let over = false;
  let iterate = (accept?: PushIterator.Acceptor<T>): void => {
    if (accept && !forNext(accept)) {
      over = true;
      iterate = PushIterator$dontIterate;
    }
  };

  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol](accept) {
      iterate(accept);
      return this;
    },
    next: PushIterator$next,
    isOver: () => over,
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

/**
 * @internal
 */
export function PushIterator$noNext<T>(): IteratorReturnResult<T> {
  return { done: true } as IteratorReturnResult<T>;
}

/**
 * @internal
 */
export function PushIterator$dontIterate<T>(
    _accept?: PushIterator.Acceptor<T>, // unused parameter to prevent deoptimization
): void {
  /* do not iterate */
}

/**
 * @internal
 */
export const emptyPushIterator: PushIterator<any> & PushIterable<any> = {
  [Symbol.iterator]: PushIterator$iterator,
  [PushIterator__symbol](
      _accept, // unused parameter to prevent deoptimization
  ) {
    return this;
  },
  next: () => ({ done: true } as IteratorReturnResult<unknown>),
  isOver: () => true,
};
