/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf } from '../iterator-of';
import { itsIterator } from '../its-iterator';
import { makePushIterator } from '../make-push-iterator';
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
  return {
    [Symbol.iterator]() {

      const it = iteratorOf(source);

      return makePushIterator(it.forNext ? flatMapPusher(it, convert) : flatMapRawPusher(it, convert));
    },
  };
}

/**
 * @internal
 */
function flatMapPusher<T, R>(
    it: PushIterator<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterator.Pusher<R> {

  let cIt: PushIterator<R> | undefined;
  let lastSrc = false;

  return accept => {
    for (; ;) {
      while (!cIt) {
        if (!it.forNext(src => {
          cIt = itsIterator(convert(src));
          return false;
        })) {
          if (!cIt) {
            return false;
          }
          lastSrc = true;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let goOn: boolean | void;

      if (!cIt.forNext(element => goOn = accept(element))) {
        cIt = undefined;
        if (lastSrc) {
          return false;
        }
      }
      if (goOn === false) {
        return true;
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

  let cIt: PushIterator<R> | undefined;

  return accept => {
    for (; ;) {
      if (!cIt) {

        const next = it.next();

        if (next.done) {
          return false;
        }

        cIt = itsIterator(convert(next.value));
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let goOn: boolean | void;

      if (!cIt.forNext(element => goOn = accept(element))) {
        cIt = undefined;
      }
      if (goOn === false) {
        return true;
      }
    }
  };
}
