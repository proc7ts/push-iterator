/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator__symbol } from '../push-iterator';

/**
 * Creates a {@link PushIterable push iterable} over one value.
 *
 * @typeParam T  Iterated element value type.
 * @param value  A value to iterate over.
 *
 * @returns New push iterable over the given value.
 */
export function overOne<T>(value: T): PushIterable<T> {

  const iterate = (): PushIterator<T> => oneValueIterator(value);

  return {
    [Symbol.iterator]: iterate,
    [PushIterator__symbol]: iterate,
  };
}

/**
 * @internal
 */
function oneValueIterator<T>(value: T): PushIterator<T> {

  let done = false;
  const iterator: PushIterator<T> = {
    [Symbol.iterator]: () => iterator,
    [PushIterator__symbol]: () => iterator,
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

  return iterator;
}
