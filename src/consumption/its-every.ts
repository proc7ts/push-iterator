/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';
import type { PushIterator } from '../push-iterator';

/**
 * Tests whether all elements of the given `iterable` pass the test implemented by the provided function.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable to test elements of.
 * @param test  A predicate function to test each element. Returns `true` to continue tests, or `false` to stop it
 * and return `false` from the method call. It accepts the tested element as the only parameter.
 *
 * @returns `true` if the `test` function returned a truthy value for every element, or `false` otherwise.
 * Returns `true` for empty iterable.
 */
export function itsEvery<T>(
    iterable: Iterable<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  const it = iteratorOf(iterable);
  const forNext = it.forNext;

  return forNext ? pushedEvery(forNext, test) : rawEvery(it, test);
}

/**
 * @internal
 */
function pushedEvery<T>(
    forNext: PushIterator.Pusher<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  let allMatch = true;

  forNext(element => allMatch = !!test(element));

  return allMatch;
}

/**
 * @internal
 */
function rawEvery<T>(
    it: Iterator<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  let allMatch = true;
  let done: boolean | undefined;

  do {

    const next = it.next();

    if (!(done = next.done)) {
      allMatch = !!test(next.value);
    }
  } while (allMatch && !done);

  return allMatch;
}
