/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterator } from '../its-iterator';
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a {@link PushIterable push iterable} with the results of calling a provided function on every element of the
 * `source` iterable.
 *
 * @typeParam T  A type of source elements.
 * @typeParam R  A type of converted elements.
 * @param source  A source iterable.
 * @param convert  A function that produces an element of the new iterable, taking the source element as the only
 * parameter.
 *
 * @returns New push iterable of transformed elements.
 */
export function mapIt<T, R>(
    source: PushOrRawIterable<T>,
    convert: (this: void, element: T) => R,
): PushIterable<R> {
  return {
    [Symbol.iterator](): PushIterator<R> {

      const it = itsIterator(source);

      return makePushIterator(accept => it.forNext(element => accept(convert(element))));
    },
  };
}
