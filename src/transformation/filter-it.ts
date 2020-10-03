/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import { PushIterable__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

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
  return {
    [PushIterable__symbol]: 1,
    [Symbol.iterator]() {

      const it = source[Symbol.iterator]();
      const forNext = it.forNext;
      let pusher: PushIterator.Pusher<T>;

      if (forNext) {
        pusher = accept => forNext(element => !test(element) || accept(element));
      } else {
        pusher = accept => {
          for (; ;) {

            const next = it.next();

            if (next.done) {
              return false;
            }

            const value = next.value;

            if (test(value) && accept(value) === false) {
              return true;
            }
          }
        };
      }

      return makePushIterator(pusher);
    },
  };
}
