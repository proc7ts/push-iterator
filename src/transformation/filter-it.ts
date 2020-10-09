/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { isPushIterable, iteratorOf, makePushIterable, makePushIterator, pushHead } from '../base';
import { overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
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
    source: Iterable<T>,
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
    source: Iterable<T>,
    test: (this: void, element: T) => element is R,
): PushIterable<R>;

export function filterIt<T>(
    source: Iterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterable<T> {
  return makePushIterable(accept => {

    const forNext = isPushIterable(source) ? filterPusher(source, test) : filterRawPusher(source, test);

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  });
}

/**
 * @internal
 */
function filterPusher<T>(
    it: PushIterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterator.Pusher<T> {
  return accept => {

    const tail = pushHead(
        it,
        element => {
          if (test(element)) {
            return accept(element);
          }
          return;
        },
    );

    it = tail;

    return !tail.isOver();
  };
}

/**
 * @internal
 */
function filterRawPusher<T>(
    source: Iterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterator.Pusher<T> {

  const it = iteratorOf(source);

  if (isPushIterable(it)) {
    return filterPusher(it, test);
  }

  return accept => {
    for (; ;) {

      const next = it.next();

      if (next.done) {
        return false;
      }

      const value = next.value;

      if (test(value)) {

        const status = accept(value);

        if (status === true || status === false) {
          return status;
        }
      }
    }
  };
}
