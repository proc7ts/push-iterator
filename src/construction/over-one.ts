import { makePushIterable } from '../base';
import { PushIterator$iterator } from '../base/make-push-iterator';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import { overNone } from './over-none';

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

/**
 * @internal
 */
function iterateOverOneValue<T>(value: T): PushIterable.Iterate<T> {
  return accept => {
    if (accept) {
      accept(value);
      return overNone();
    }

    let over = false;

    return {
      [Symbol.iterator]: PushIterator$iterator,
      [PushIterator__symbol](accept) {
        if (over) {
          return overNone();
        }
        if (accept) {
          over = true;
          accept(value);
          return overNone();
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
