/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator__symbol } from '../push-iterator';

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

  const iterateOverSource = source[PushIterator__symbol];
  let iterate: () => PushIterator<R>;

  if (iterateOverSource) {
    iterate = () => {

      const it = iterateOverSource();

      return makePushIterator(accept => it.forNext(element => accept(convert(element))));
    };
  } else {
    iterate = () => mapIterator(source[Symbol.iterator](), convert);
  }

  return {
    [Symbol.iterator]: iterate,
    [PushIterator__symbol]: iterate,
  };
}

/**
 * @internal
 */
function mapIterator<T, R>(it: Iterator<T>, convert: (this: void, element: T) => R): PushIterator<R> {

  const iterator: PushIterator<R> = {

    [Symbol.iterator]: () => iterator,

    [PushIterator__symbol]: () => iterator,

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

  return iterator;
}
