/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { itsIterator } from '../its-iterator';
import { makePushIterator } from '../make-push-iterator';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
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
export function overElementsOf<T>(...sources: Iterable<T>[]): PushIterable<T> {
  if (sources.length > 1) {
    return {
      [Symbol.iterator](): PushIterator<T> {

        let i = 0;
        let it: PushIterator<T> = itsIterator(sources[0]);

        return makePushIterator(accept => {
          for (;;) {

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
      },
    };
  }
  if (sources.length) {
    return overIterable(sources[0]);
  }
  return overNone();
}
