import type { PushIterable } from '../push-iterable';
import { flatMap$transformer } from './flat-map.transformer.impl';
import { transformIt } from './transform-it';

/**
 * Flattens the source iterable of iterables into new {@link PushIterable | push iterable}.
 *
 * Calling this function is the same as calling `flatMapIt(source, element => element)`.
 *
 * @typeParam T - A type of converted elements.
 * @param source - A source iterable of iterables.
 *
 * @returns New push iterable with each element of `source` being flattened.
 */
export function flatMapIt<T>(source: Iterable<Iterable<T>>): PushIterable<T>;

/**
 * First maps each element of the `source` iterable using a mapping function, then flattens the result into new
 * {@link PushIterable | push iterable}.
 *
 * @typeParam TSrc - A type of source elements.
 * @typeParam TConv - A type of converted elements.
 * @param source - A source iterable of elements to convert.
 * @param convert - A function that produces new iterable, taking the source element as the only parameter.
 *
 * @returns New push iterable with each element being the flattened result of the `convert` function call.
 */
export function flatMapIt<TSrc, TConv>(
    source: Iterable<TSrc>,
    convert: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterable<TConv>;

export function flatMapIt<TSrc, TConv>(
    source: Iterable<TSrc>,
    convert?: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterable<TConv> {
  return transformIt(source, flatMap$transformer(convert));
}
