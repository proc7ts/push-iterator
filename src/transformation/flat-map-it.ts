/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterator } from '../its-iterator';
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator__symbol } from '../push-iterator';

/**
 * @internal
 */
const flatMapIt$defaultConverter = <T, R>(element: T): PushOrRawIterable<R> => element as unknown as Iterable<R>;

/**
 * Flattens the source iterable of iterables into new {@link PushIterable push iterable}.
 *
 * Calling this function is the same as calling `flatMapIt(source, element => element)`.
 *
 * @typeParam T  A type of source elements.
 * @param source  A source iterable of iterables.
 *
 * @returns New push iterable with each element of `source` being the flattened.
 */
export function flatMapIt<T>(source: PushOrRawIterable<Iterable<T>>): PushIterable<T>;

/**
 * First maps each element of the `source` iterable using a mapping function, then flattens the result into new
 * {@link PushIterable push iterable}.
 *
 * @typeParam T  A type of source elements.
 * @typeParam R  A type of converted elements.
 * @param source  A source iterable.
 * @param convert  A function that produces a new iterable, taking the source element as the only parameter.
 *
 * @returns New push iterable with each element being the flattened result of the `convert` function call.
 */
export function flatMapIt<T, R>(
    source: PushOrRawIterable<T>,
    convert: (this: void, element: T) => PushOrRawIterable<R>,
): PushIterable<R>;

export function flatMapIt<T, R>(
    source: PushOrRawIterable<T>,
    convert: (this: void, element: T) => PushOrRawIterable<R> = flatMapIt$defaultConverter,
): PushIterable<R> {

  const iterateOverSource = source[PushIterator__symbol];
  let iterate: () => PushIterator<R>;

  if (iterateOverSource) {
    iterate = () => flatMapPushIterator(iterateOverSource(), convert);
  } else {
    iterate = () => flatMapRawIterator(source[Symbol.iterator](), convert);
  }

  return {
    [Symbol.iterator]: iterate,
    [PushIterator__symbol]: iterate,
  };
}

/**
 * @internal
 */
function flatMapPushIterator<T, R>(
    it: PushIterator<T>,
    convert: (this: void, element: T) => PushOrRawIterable<R>,
): PushIterator<R> {

  let cIt: PushIterator<R> | undefined;
  let lastSrc = false;

  return makePushIterator(accept => {
    for (;;) {
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
  });
}

/**
 * @internal
 */
function flatMapRawIterator<T, R>(
    it: Iterator<T>,
    convert: (this: void, element: T) => PushOrRawIterable<R>,
): PushIterator<R> {

  let cIt: PushIterator<R> | undefined;

  return makePushIterator(accept => {
    for (;;) {
      while (!cIt) {

        const { done, value } = it.next();

        if (done) {
          return false;
        }
        cIt = itsIterator(convert(value));
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
  });
}
