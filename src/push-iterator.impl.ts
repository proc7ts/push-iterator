import { PushIterable, PushIterable__symbol, PushOrRawIterable } from './push-iterable';
import type { PushIterator, PushOrRawIterator } from './push-iterator';

/**
 * @internal
 */
export function iteratorOf<T>(iterable: PushOrRawIterable<T>): PushOrRawIterator<T> {
  return iterable[Symbol.iterator]();
}

/**
 * @internal
 */
export function rawIteratorOf<T>(iterable: Iterable<T>): Iterator<T> {
  return iterable[Symbol.iterator]();
}

/**
 * @internal
 */
export function pusherOf<T>(iterable: PushIterable<T>): PushIterator.Pusher<T> {
  return iterable[Symbol.iterator]().forNext;
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
export const noneIterator: PushIterator<never> & PushIterable<never> = {
  [PushIterable__symbol]: 1,
  [Symbol.iterator]: PushIterator$iterator,
  next: () => ({ done: true } as IteratorReturnResult<unknown>),
  forNext: () => false,
};

/**
 * @internal
 */
export function oneValueIterator<T>(value: T): PushIterator<T> {

  let done = false;

  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]: PushIterator$iterator,
    next() {
      if (done) {
        return { done } as IteratorReturnResult<undefined>;
      }
      done = true;
      return { value };
    },
    forNext(accept) {
      if (!done) {
        done = true;
        accept(value);
      }
      return false;
    },
  };
}

/**
 * @internal
 */
export function toPushIterator<T>(it: Iterator<T>): PushIterator<T> {
  return {

    [PushIterable__symbol]: 1,

    [Symbol.iterator]: PushIterator$iterator,

    next: () => it.next(),

    forNext(accept) {
      for (; ;) {

        const res = it.next();

        if (res.done) {
          return false;
        }
        if (accept(res.value) === false) {
          return true;
        }
      }
    },

  };
}
