/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import { isPushIterable, PushIterable__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$iterator } from '../push-iterator.impl';

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

  let iterate: () => PushIterator<R>;

  if (isPushIterable(source)) {
    iterate = () => {

      const it = source[Symbol.iterator]();

      return makePushIterator(accept => it.forNext(element => accept(convert(element))));
    };
  } else {
    iterate = () => mapRawIterator(source[Symbol.iterator](), convert);
  }

  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]: iterate,
  };
}

/**
 * @internal
 */
function mapRawIterator<T, R>(it: Iterator<T>, convert: (this: void, element: T) => R): PushIterator<R> {
  return {

    [PushIterable__symbol]: 1,

    [Symbol.iterator]: PushIterator$iterator,

    next() {

      const next = it.next();

      if (next.done) {
        return next;
      }

      return { value: convert(next.value) };
    },

    forNext(accept) {
      for (; ;) {

        const next = it.next();

        if (next.done) {
          return false;
        }
        if (accept(convert(next.value)) === false) {
          return true;
        }
      }
    },

  };
}
