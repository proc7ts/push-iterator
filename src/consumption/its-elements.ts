/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import type { PushOrRawIterable } from '../push-iterable';
import { isPushIterable } from '../push-iterable';
import { pusherOf } from '../push-iterator.impl';

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
export function itsElements<T>(source: PushOrRawIterable<T>): T[];

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
export function itsElements<T, R>(source: PushOrRawIterable<T>, convert: (this: void, element: T) => R): R[];

export function itsElements<T, R>(
    source: PushOrRawIterable<T>,
    convert: (this: void, element: T) => R = itsElements$defaultConverter,
): R[] {
  if (isPushIterable(source)) {

    const result: R[] = [];

    pusherOf(source)(element => {
      result.push(convert(element));
    });

    return result;
  }
  return Array.from(source, convert);
}
