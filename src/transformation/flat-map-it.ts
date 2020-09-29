/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterator } from '../its-iterator';
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

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
export function flatMapIt<T>(source: Iterable<Iterable<T>>): PushIterable<T>;

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
    source: Iterable<T> | PushIterable<T>,
    convert: (this: void, element: T) => Iterable<R> | PushIterable<R>,
): PushIterable<R>;

export function flatMapIt<T, R>(
    source: Iterable<T> | PushIterable<T>,
    convert: (this: void, element: T) => Iterable<R> | PushIterable<R> = (element: any) => element,
): PushIterable<R> {
  return {
    [Symbol.iterator](): PushIterator<R> {

      const it = itsIterator(source);
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
    },
  };
}
