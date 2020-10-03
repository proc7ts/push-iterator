/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import { PushIterable__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a {@link PushIterable push iterable} with the results of calling a provided function on every element of the
 * `source` iterable.
 *
 * @typeParam T  A type of source elements.
 * @typeParam R  A type of converted elements.
 * @param source  A source iterable.
 * @param convert  A function that produces an element of the new iterable, taking the source element as the only
 * parameter.
 *
 * @returns New push iterable of transformed elements.
 */
export function mapIt<T, R>(
    source: PushOrRawIterable<T>,
    convert: (this: void, element: T) => R,
): PushIterable<R> {
  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]() {

      const it = source[Symbol.iterator]();
      const forNext = it.forNext;
      let pusher: PushIterator.Pusher<R>;

      if (forNext) {
        pusher = accept => forNext(element => accept(convert(element)));
      } else {
        pusher = accept => {
          for (; ;) {

            const next = it.next();

            if (next.done) {
              return false;
            }
            if (accept(convert(next.value)) === false) {
              return true;
            }
          }
        };
      }

      return makePushIterator(pusher);
    },
  };
}
