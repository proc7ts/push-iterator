import { iterateGenerated, iterateIt, makePushIterable } from '../base';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { overIterable } from './over-iterable';
import { overNone } from './over-none';

/**
 * Creates a {@link PushIterable | push iterable} over elements of other iterables.
 *
 * @typeParam T - Iterated elements type.
 * @param sources - Source iterables to iterate over elements of.
 *
 * @returns New push iterable over elements of the given `sources`.
 */
export function overElementsOf<T>(...sources: readonly Iterable<T>[]): PushIterable<T> {
  return sources.length > 1
      ? makePushIterable(accept => overElementsOf$iterate(sources, accept))
      : (sources.length
          ? overIterable(sources[0])
          : overNone());
}

function overElementsOf$iterate<T>(
    sources: readonly Iterable<T>[],
    accept?: PushIterator.Acceptor<T>,
): PushIterator<T> {
  return iterateGenerated<T, [number, Iterable<T>]>(
      (push, [index, source] = [0, sources[0]]): [number, Iterable<T>] | false => {
        for (; ;) {

          let pushResult: boolean | void;
          const tail = iterateIt(source, element => pushResult = push(element));

          if (pushResult === false) {
            return false;
          }
          if (tail.isOver()) {
            if (++index >= sources.length) {
              return false;
            }
            source = sources[index];
          } else {
            source = tail;
          }

          if (pushResult != null) {
            return [index, source];
          }
        }
      },
      accept,
  );
}
