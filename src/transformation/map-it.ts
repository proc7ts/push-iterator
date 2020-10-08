/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { isPushIterable, iteratorOf, makePushIterable, makePushIterator, pushIterated } from '../base';
import { overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
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
    source: Iterable<T>,
    convert: (this: void, element: T) => R,
): PushIterable<R> {
  return makePushIterable(accept => {

    const it = iteratorOf(source);
    const forNext = isPushIterable(it) ? mapPusher(it, convert) : mapRawPusher(it, convert);

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  });
}

/**
 * @internal
 */
function mapPusher<R, T>(
    it: PushIterator<T>,
    convert: (this: void, element: T) => R,
): PushIterator.Pusher<R> {
  return accept => pushIterated(it, element => accept(convert(element)));
}

/**
 * @internal
 */
function mapRawPusher<R, T>(
    it: Iterator<T>,
    convert: (this: void, element: T) => R,
): PushIterator.Pusher<R> {
  return accept => {
    for (; ;) {

      const next = it.next();

      if (next.done) {
        return false;
      }

      const status = accept(convert(next.value));

      if (status === true || status === false) {
        return status;
      }
    }
  };
}
