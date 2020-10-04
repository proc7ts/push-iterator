/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';
import type { PushIterator } from '../push-iterator';

/**
 * @internal
 */
const itsElements$defaultConverter = <T, R>(element: T): R => element as unknown as R;

/**
 * Creates a new, shallow-copied array instance containing elements of the `source` iterable.
 *
 * Calling this function result to the same result as calling `Array.from(source)`, except it is optimized for
 * {@link PushIterable push iterables}.
 *
 * @typeParam T  Iterated elements type.
 * @param source  A source iterable to copy elements from.
 *
 * @returns New array of `source` elements.
 */
export function itsElements<T>(source: Iterable<T>): T[];

/**
 * Creates a new, shallow-copied array instance containing elements of the `source` iterable converted by the given
 * converter function.
 *
 * Calling this function result to the same result as calling `Array.from(source, convert)`, except it is optimized for
 * {@link PushIterable push iterables}.
 *
 * @typeParam T  Iterated elements type.
 * @typeParam R  Resulting array elements type.
 * @param source  A source iterable to convert elements from.
 * @param convert  A function that produces an element of result array, taking element of `source` iterable as the only
 * parameter.
 *
 * @returns New array of elements converted from `source` ones.
 */
export function itsElements<T, R>(source: Iterable<T>, convert: (this: void, element: T) => R): R[];

export function itsElements<T, R>(
    source: Iterable<T>,
    convert: (this: void, element: T) => R = itsElements$defaultConverter,
): R[] {

  const it = iteratorOf(source);

  return it.forNext ? pushedElements(it, convert) : Array.from(source, convert);
}

/**
 * @internal
 */
function pushedElements<T, R>(
    it: PushIterator<T>,
    convert: (this: void, element: T) => R,
): R[] {

  const result: R[] = [];

  it.forNext(element => {
    result.push(convert(element));
  });

  return result;
}
