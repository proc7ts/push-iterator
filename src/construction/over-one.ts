/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable } from '../base';
import { PushIterator$iterate, PushIterator$iterator } from '../impl';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a {@link PushIterable push iterable} over one value.
 *
 * @typeParam T  Iterated element value type.
 * @param value  A value to iterate over.
 *
 * @returns New push iterable over the given value.
 */
export function overOne<T>(value: T): PushIterable<T> {
  return makePushIterable(iterateOverOneValue(value));
}

/**
 * @internal
 */
function iterateOverOneValue<T>(value: T): PushIterable.Iterate<T> {
  return accept => {

    let done = false;
    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      if (!done) {
        done = true;
        accept(value);
      }

      return false;
    };

    return accept
        ? forNext(accept)
        : {
          [Symbol.iterator]: PushIterator$iterator,
          [PushIterator__symbol]: PushIterator$iterate,
          next() {
            if (done) {
              return { done } as IteratorReturnResult<undefined>;
            }

            done = true;

            return { value };
          },
          forNext,
        };
  };
}
