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
export function overElementsOf<T>(...sources: readonly Iterable<T>[]): PushIterable<T> {
  return sources.length > 1
      ? { [Symbol.iterator]: () => makePushIterator(subElementsPusher(sources)) }
      : (sources.length
          ? overIterable(sources[0])
          : overNone());
}

/**
 * @internal
 */
function subElementsPusher<T>(sources: readonly Iterable<T>[]): PushIterator.Pusher<T> {

  let i = 0;
  let forNext: PushIterator.Pusher<T> = itsIterator(sources[0]).forNext;

  return accept => {
    for (; ;) {

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let goOn: boolean | void;

      if (!forNext(element => goOn = accept(element))) {
        if (++i >= sources.length) {
          return false;
        }

        forNext = itsIterator(sources[i]).forNext;
      }
      if (goOn === false) {
        return true;
      }
    }
  };
}
