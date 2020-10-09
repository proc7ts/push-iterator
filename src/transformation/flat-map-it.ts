/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { isPushIterable, iteratorOf, makePushIterable, makePushIterator, pushHead } from '../base';
import { overNone } from '../construction';
import { itsHead } from '../consumption';
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

    const forNext = isPushIterable(source) ? flatMapPusher(source, convert) : flatMapRawPusher(source, convert);

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  });
}

/**
 * @internal
 */
function flatMapPusher<T, R>(
    source: PushIterable<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterator.Pusher<R> {

  let subs: Iterable<R> | undefined;
  let lastSrc = false;

  return accept => {
    for (; ;) {
      while (!subs) {

        const sourceTail = pushHead(source, src => {
          subs = convert(src);
          return true;
        });

        source = sourceTail;

        if (sourceTail.isOver()) {
          if (!subs) {
            return false;
          }
          lastSrc = true;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let status: boolean | void;
      const subsTail: PushIterator<R> = itsHead(subs, element => status = accept(element));

      if (subsTail.isOver()) {
        subs = undefined;
        if (lastSrc) {
          return false;
        }
      } else {
        subs = subsTail;
      }

      if (typeof status === 'boolean') {
        return status;
      }
    }
  };
}

/**
 * @internal
 */
function flatMapRawPusher<T, R>(
    source: Iterable<T>,
    convert: (this: void, element: T) => Iterable<R>,
): PushIterator.Pusher<R> {

  const it = iteratorOf(source);

  if (isPushIterable(it)) {
    return flatMapPusher(it, convert);
  }

  let subs: Iterable<R> | undefined;

  return accept => {
    for (; ;) {
      if (!subs) {

        const next = it.next();

        if (next.done) {
          return false;
        }

        subs = convert(next.value);
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let status: boolean | void;
      const subsTail: PushIterator<R> = itsHead(subs, element => status = accept(element));

      subs = subsTail.isOver() ? undefined : subsTail;
      if (typeof status === 'boolean') {
        return status;
      }
    }
  };
}
