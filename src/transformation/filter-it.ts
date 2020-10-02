/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator__symbol } from '../push-iterator';

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

  const iterateOverSource = source[PushIterator__symbol];
  let iterate: () => PushIterator<T>;

  if (iterateOverSource) {
    iterate = () => {

      const it = iterateOverSource();

      return makePushIterator(accept => it.forNext(element => !test(element) || accept(element)));
    };
  } else {
    iterate = () => {

      const it = source[Symbol.iterator]();

      return makePushIterator(accept => {
        for (;;) {

          const { done, value } = it.next();

          if (done) {
            return false;
          }
          if (test(value) && accept(value) === false) {
            return true;
          }
        }
      });
    };
  }

  return {
    [Symbol.iterator]: iterate,
    [PushIterator__symbol]: iterate,
  };
}
