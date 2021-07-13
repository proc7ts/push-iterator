import { iterateOver, makePushIterable } from '../base';
import { itsHead } from '../consumption';
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
  return iterateOver<T, [number, Iterable<T>]>(
      (push, state = overElementsOf$first(sources)) => {

        let [index, source] = state;

        if (index < sources.length) {
          for (; ;) {

            let result: boolean | void;
            const tail = itsHead(source, (element: T): boolean | void => result = push(element, state));

            if (tail.isOver()) {
              if ((state[0] = ++index) >= sources.length) {
                break;
              }
              state[1] = source = sources[index];
            } else {
              state[1] = source = tail;
            }
            if (result != null) {
              break;
            }
          }
        }
      },
      accept,
  );
}

function overElementsOf$first<T>([first]: readonly Iterable<T>[]): [number, Iterable<T>] {
  return [0, first];
}
