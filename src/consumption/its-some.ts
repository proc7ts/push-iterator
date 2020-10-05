/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';
import type { PushIterator } from '../push-iterator';

/**
 * Tests whether at least one element of the given `iterable` passes the test implemented by the provided function.
 *
 * @typeParam T  A type of `iterable` elements.
 * @param iterable  An iterable to test elements of.
 * @param test  A predicate function to test each element. Returns `false` to continue tests, or `true` to stop it
 * and return `true` from the method call. It accepts the tested element as the only parameter.
 *
 * @returns `true` if the callback function returned a truthy value for at least one element in the array, or `false`
 * otherwise. Returns `false` for empty iterable.
 */
export function itsSome<T>(
    iterable: Iterable<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  const it = iteratorOf(iterable);

  return it.forNext ? pushedSome(it, test) : rawSome(it, test);
}

/**
 * @internal
 */
function pushedSome<T>(
    it: PushIterator<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  let someMatches = false;

  it.forNext(element => !(someMatches = !!test(element)));

  return someMatches;
}

/**
 * @internal
 */
function rawSome<T>(
    it: Iterator<T>,
    test: (this: void, element: T) => boolean,
): boolean {

  let someMatches = false;

  for (; ;) {

    const next = it.next();

    if (next.done) {
      return someMatches;
    }
    if ((someMatches = !!test(next.value))) {
      return true;
    }
  }
}
