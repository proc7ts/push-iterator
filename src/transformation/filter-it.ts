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
 * @typeParam T  A type of source elements.
 * @typeParam TTarget  Target type.
 * @param source  A source iterable.
 * @param test  A predicate function to test that element extends the type `TTarget`. Returns `true` to keep the
 * element, or`false` otherwise. It accepts the tested element as the only parameter.
 *
 * @return New push iterable with the elements that pass the test. If no elements passed the test, an empty iterable
 * will be returned.
 */
export function filterIt<T, TTarget extends T>(
    source: Iterable<T>,
    test: (this: void, element: T) => element is TTarget,
): PushIterable<TTarget>;

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
    source: PushIterable<T>,
    test: (this: void, element: T) => boolean,
): PushIterator.Pusher<T> {
  return accept => {

    const tail = pushHead(
        source,
        element => {
          if (test(element)) {
            return accept(element);
          }
          return;
        },
    );

    source = tail;

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

        if (typeof status === 'boolean') {
          return status;
        }
      }
    }
  };
}
