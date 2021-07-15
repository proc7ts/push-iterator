import { isPushIterable } from '../base';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';

const itsElements$defaultConverter = <T, TConv>(element: T): TConv => element as unknown as TConv;

/**
 * Creates a new, shallow-copied array instance containing elements of the `source` iterable.
 *
 * Calling this function result to the same result as calling `Array.from(source)`, except it is optimized for
 * {@link PushIterable push iterables}.
 *
 * @typeParam T - Iterated elements type.
 * @param source - A source iterable to copy elements from.
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
 * @typeParam T - Iterated elements type.
 * @typeParam TConv - Resulting array elements type.
 * @param source - A source iterable to convert elements from.
 * @param convert - A function that produces an element of result array, taking element of `source` iterable as the only
 * parameter.
 *
 * @returns New array of elements converted from `source` ones.
 */
export function itsElements<T, TConv>(source: Iterable<T>, convert: (this: void, element: T) => TConv): TConv[];

export function itsElements<T, TConv>(
    source: Iterable<T>,
    convert?: (this: void, element: T) => TConv,
): TConv[] {
  if (isPushIterable(source)) {
    return itsElements$(source, convert);
  }

  const it = source[Symbol.iterator]();

  return isPushIterable(it)
      ? itsElements$(it, convert)
      : convert
          ? Array.from(source, convert)
          : [...source] as unknown[] as TConv[];
}

function itsElements$<T, TConv>(
    it: PushIterable<T>,
    convert: (this: void, element: T) => TConv = itsElements$defaultConverter,
): TConv[] {

  const result: TConv[] = [];

  it[PushIterator__symbol](element => { result.push(convert(element)); });

  return result;
}
