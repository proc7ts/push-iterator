/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterator } from '../its-iterator';
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable, PushOrRawIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator__symbol } from '../push-iterator';
import { overIterable } from './over-iterable';
import { overNone } from './over-none';

/**
 * Creates a {@link PushIterable push iterable} over elements of other iterables.
 *
 * @typeParam T  Iterated elements type.
 * @param sources  Source iterables to iterate over elements of.
 *
 * @returns New push iterable over elements of the given `sources`.
 */
export function overElementsOf<T>(...sources: readonly PushOrRawIterable<T>[]): PushIterable<T> {
  if (sources.length > 1) {

    const iterate = (): PushIterator<T> => {

      let i = 0;
      let it: PushIterator<T> = itsIterator(sources[0]);

      return makePushIterator(accept => {
        for (;;) {

          // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
          let goOn: boolean | void;

          if (!it.forNext(element => goOn = accept(element))) {
            if (++i >= sources.length) {
              return false;
            }
            it = itsIterator(sources[i]);
          }
          if (goOn === false) {
            return true;
          }
        }
      });
    };

    return {
      [Symbol.iterator]: iterate,
      [PushIterator__symbol]: iterate,
    };
  }
  if (sources.length) {
    return overIterable(sources[0]);
  }
  return overNone();
}
