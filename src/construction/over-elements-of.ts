/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { makePushIterable, makePushIterator, pushIterated } from '../base';
import { itsIterator } from '../consumption';
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
      ? makePushIterable(iterateOverSubElements(sources))
      : (sources.length
          ? overIterable(sources[0])
          : overNone());
}

/**
 * @internal
 */
function iterateOverSubElements<T>(sources: readonly Iterable<T>[]): PushIterable.Iterate<T> {
  return accept => {

    let i = 0;
    let srcIt = itsIterator(sources[0]);

    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      for (; ;) {

        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        let goOn: boolean | void;

        if (!pushIterated(srcIt, element => goOn = accept(element))) {
          if (++i >= sources.length) {
            return false;
          }

          srcIt = itsIterator(sources[i]);
        }
        if (goOn === false) {
          return true;
        }
      }
    };

    return accept ? forNext(accept) : makePushIterator(forNext);
  };
}
