/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import { isPushIterable, PushIterable__symbol } from '../push-iterable';
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
  return isPushIterable(source) ? mapPushIterable(source, convert) : mapRawIterable(source, convert);
}

/**
 * @internal
 */
function mapPushIterable<T, R>(source: PushIterable<T>, convert: (this: void, element: T) => R): PushIterable<R> {
  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]() {

      const it = source[Symbol.iterator]();

      return {

        [PushIterable__symbol]: 1,
        [Symbol.iterator]: PushIterator$iterator,

        next() {
          for (;;) {

            let next: IteratorResult<R> | undefined;

            if (!it.forNext(element => {
              next = { value: convert(element) };
              return false;
            })) {
              if (!next) {
                next = { done: true } as IteratorReturnResult<T>;
              }
            }

            if (next) {
              return next;
            }
          }
        },

        forNext: accept => it.forNext(element => accept(convert(element))),

      };
    },
  };
}

/**
 * @internal
 */
function mapRawIterable<T, R>(source: Iterable<T>, convert: (this: void, element: T) => R): PushIterable<R> {
  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]() {

      const it = source[Symbol.iterator]();

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
    },
  };
}
