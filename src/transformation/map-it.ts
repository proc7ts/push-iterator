import type { PushIterable } from '../push-iterable';
import { transformIt } from './transform-it';

/**
 * Creates a {@link PushIterable | push iterable} with the results of calling a provided function on every element
 * of the `source` iterable.
 *
 * @typeParam TSrc - A type of source elements.
 * @typeParam TConv - A type of converted elements.
 * @param source - A source iterable.
 * @param convert - A function that produces an element of the new iterable, taking the source element as the only
 * parameter.
 *
 * @returns New push iterable of transformed elements.
 */
export function mapIt<TSrc, TConv>(
    source: Iterable<TSrc>,
    convert: (this: void, element: TSrc) => TConv,
): PushIterable<TConv> {
  return transformIt(
      source,
      (push, src): boolean | void => push(convert(src)),
  );
}
