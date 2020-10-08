/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { isPushIterable, iteratorOf, makePushIterable, makePushIterator, pushIterated } from '../base';
import { overNone } from '../construction';
import { itsIterator } from '../consumption';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { flatMapIt$defaultConverter } from './transformation.impl';

/**
 * Flattens the source iterable of iterables into new {@link PushIterable push iterable}.
 *
 * Calling this function is the same as calling `flatMapIt(source, element => element)`.
 *
 * @typeParam T  A type of converted elements.
 * @param source  A source iterable of iterables.
 *
 * @returns New push iterable with each element of `source` being the flattened.
 */
export function flatMapIt<T>(source: Iterable<Iterable<T>>): PushIterable<T>;

/**
 * First maps each element of the `source` iterable using a mapping function, then flattens the result into new
 * {@link PushIterable push iterable}.
 *
 * @typeParam T  A type of source elements.
 * @typeParam R  A type of converted elements.
 * @param source  A source iterable of iterables.
 * @param convert  A function that produces new iterable, taking the source element as the only parameter.
 *
 * @returns New push iterable with each element being the flattened result of the `convert` function call.
 */
export function flatMapIt<T, R>(
    source: Iterable<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterable<R>;

export function flatMapIt<T, R>(
    source: Iterable<T>,
    convert: (this: void, element: T) => Iterable<R> = flatMapIt$defaultConverter,
): PushIterable<R> {
  return makePushIterable(accept => {

    const it = iteratorOf(source);
    const forNext = isPushIterable(it) ? flatMapPusher(it, convert) : flatMapRawPusher(it, convert);

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  });
}

/**
 * @internal
 */
function flatMapPusher<T, R>(
    it: PushIterator<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterator.Pusher<R> {

  let subIt: PushIterator<R> | undefined;
  let lastSrc = false;

  return accept => {
    for (; ;) {
      while (!subIt) {
        if (!pushIterated(it, src => {
          subIt = itsIterator(convert(src));
          return true;
        })) {
          if (!subIt) {
            return false;
          }
          lastSrc = true;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let status: boolean | void;

      if (!pushIterated(subIt, element => status = accept(element))) {
        subIt = undefined;
        if (lastSrc) {
          return false;
        }
      }
      if (status === true || status === false) {
        return status;
      }
    }
  };
}

/**
 * @internal
 */
function flatMapRawPusher<T, R>(
    it: Iterator<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterator.Pusher<R> {

  let subIt: PushIterator<R> | undefined;

  return accept => {
    for (; ;) {
      if (!subIt) {

        const next = it.next();

        if (next.done) {
          return false;
        }

        subIt = itsIterator(convert(next.value));
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let status: boolean | void;

      if (!pushIterated(subIt, element => status = accept(element))) {
        subIt = undefined;
      }
      if (status === true || status === false) {
        return status;
      }
    }
  };
}
