import { isPushIterable, iteratorOf, pushIterated } from '../base';
import type { PushIterable } from '../push-iterable';

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
    convert: (this: void, element: T) => TConv = itsElements$defaultConverter,
): TConv[] {
  if (isPushIterable(source)) {
    return pushedElements(source, convert);
  }

  const it = iteratorOf(source);

  return isPushIterable(it) ? pushedElements(it, convert) : Array.from(source, convert);
}

function pushedElements<T, TConv>(
    it: PushIterable<T>,
    convert: (this: void, element: T) => TConv,
): TConv[] {

  const result: TConv[] = [];

  pushIterated(it, element => { result.push(convert(element)); });

  return result;
}
