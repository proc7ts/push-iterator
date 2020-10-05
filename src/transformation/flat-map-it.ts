/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { iteratorOf, itsIterator, makePushIterable, makePushIterator } from '../base';
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
    const forNextSrc = it.forNext;
    const forNext = forNextSrc ? flatMapPusher(forNextSrc, convert) : flatMapRawPusher(it, convert);

    return accept ? forNext(accept) : makePushIterator(forNext);
  });
}

/**
 * @internal
 */
function flatMapPusher<T, R>(
    forNext: PushIterator.Pusher<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterator.Pusher<R> {

  let forNextSub: PushIterator.Pusher<R> | undefined;
  let lastSrc = false;

  return accept => {
    for (; ;) {
      while (!forNextSub) {
        if (!forNext(src => {
          forNextSub = itsIterator(convert(src)).forNext;
          return false;
        })) {
          if (!forNextSub) {
            return false;
          }
          lastSrc = true;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let goOn: boolean | void;

      if (!forNextSub(element => goOn = accept(element))) {
        forNextSub = undefined;
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

  let forNextSub: PushIterator.Pusher<R> | undefined;

  return accept => {
    for (; ;) {
      if (!forNextSub) {

        const next = it.next();

        if (next.done) {
          return false;
        }

        forNextSub = itsIterator(convert(next.value)).forNext;
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let goOn: boolean | void;

      if (!forNextSub(element => goOn = accept(element))) {
        forNextSub = undefined;
      }
      if (goOn === false) {
        return true;
      }
    }
  };
}
