/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import { isPushIterable, PushIterable__symbol } from '../push-iterable';
import { PushIterator$iterator } from '../push-iterator.impl';

/**
 * Creates a {@link PushIterable push iterable} with all `source` iterable elements that pass the test implemented by
 * the provided function.
 *
 * @typeParam T  A type of source elements.
 * @param source  A source iterable.
 * @param test  A predicate function to test each element. Returns `true` to keep the element, or `false` otherwise.
 * It accepts the tested element as the only parameter.
 *
 * @return New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterIt<T>(
    source: PushOrRawIterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T>;

/**
 * Creates a {@link PushIterable push iterable} with all `source` iterable elements extending the given type.
 *
 * @typeParam T  A type of source elements
 * @typeParam R  Target type.
 * @param source  A source iterable.
 * @param test  A predicate function to test that element extends the type `R`. Returns `true` to keep the element, or
 * `false` otherwise. It accepts the tested element as the only parameter.
 *
 * @return New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterIt<T, R extends T>(
    source: PushOrRawIterable<T>,
    test: (this: void, element: T) => element is R,
): PushIterable<R>;

export function filterIt<T>(
    source: PushOrRawIterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T> {
  return isPushIterable(source) ? filterPushIterable(source, test) : filterRawIterable(source, test);
}

/**
 * @internal
 */
function filterPushIterable<T>(
    source: PushIterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T> {
  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]() {

      const it = source[Symbol.iterator]();

      return {

        [PushIterable__symbol]: 1,
        [Symbol.iterator]: PushIterator$iterator,

        next() {
          for (;;) {

            let next: IteratorResult<T> | undefined;

            if (!it.forNext(value => {
              if (test(value)) {
                next = { value };
                return false;
              }
              return;
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

        forNext: accept => it.forNext(element => !test(element) || accept(element)),
      };
    },
  };
}

/**
 * @internal
 */
function filterRawIterable<T>(
    source: Iterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T> {
  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]() {

      const it = source[Symbol.iterator]();

      return {

        [PushIterable__symbol]: 1,
        [Symbol.iterator]: PushIterator$iterator,

        next() {
          for (; ;) {

            const next = it.next();

            if (next.done || test(next.value)) {
              return next;
            }
          }
        },

        forNext(accept) {
          for (; ;) {

            const { done, value } = it.next();

            if (done) {
              return false;
            }
            if (test(value) && accept(value) === false) {
              return true;
            }
          }
        },

      };
    },
  };
}
