/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable } from '../push-iterable';
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
    source: Iterable<T>,
    convert: (this: void, element: T) => R,
): PushIterable<R> {
  return {
    [Symbol.iterator]() {

      const it = iteratorOf(source);

      return makePushIterator(it.forNext ? mapPusher(it, convert) : mapRawPusher(it, convert));
    },
  };
}

/**
 * @internal
 */
function mapPusher<R, T>(
    it: PushIterator<T>,
    convert: (this: void, element: T) => R,
): PushIterator.Pusher<R> {
  return accept => it.forNext(element => accept(convert(element)));
}

/**
 * @internal
 */
function mapRawPusher<R, T>(
    it: Iterator<T>,
    convert: (this: void, element: T) => R,
): PushIterator.Pusher<R> {
  return accept => {

    let done: number | undefined;

    do {

      const next = it.next();

      if (next.done) {
        done = -1;
      } else if (accept(convert(next.value)) === false) {
        done = 1;
      }
    } while (!done);

    return done > 0;
  };
}
