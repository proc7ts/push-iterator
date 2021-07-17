import { makePushIterable } from '../base';
import { PushIterator$empty } from '../base/push-iterator.empty.impl';
import { PushIterator$iterator } from '../base/push-iterator.impl';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';

/**
 * Creates a {@link PushIterable | push iterable} over one value.
 *
 * @typeParam T - Iterated element value type.
 * @param value - A value to iterate over.
 *
 * @returns New push iterable over the given value.
 */
export function overOne<T>(value: T): PushIterable<T> {
  return makePushIterable(iterateOverOneValue(value));
}

function iterateOverOneValue<T>(value: T): PushIterable.Iterate<T> {
  return accept => {
    if (accept) {
      accept(value);
      return PushIterator$empty;
    }

    let over = false;

    return {
      [Symbol.iterator]: PushIterator$iterator,
      [PushIterator__symbol](accept) {
        if (over) {
          return PushIterator$empty;
        }
        if (accept) {
          over = true;
          accept(value);
          return PushIterator$empty;
        }
        return this;
      },
      next() {
        if (over) {
          return { done: over } as IteratorReturnResult<undefined>;
        }

        over = true;

        return { value };
      },
      isOver: () => over,
    };

  };
}
