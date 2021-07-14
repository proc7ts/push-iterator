import { iterateGenerated, makePushIterable } from '../base';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable | push iterable} over elements of iterator created by the given function.
 *
 * @typeParam T - Iterated elements type.
 * @param iterate - A function creating new iterator.
 *
 * @returns New push iterable over elements of created iterator.
 */
export function overIterator<T>(iterate: (this: void) => Iterator<T>): PushIterable<T> {
  return makePushIterable(accept => iterateGenerated<T, [Iterator<T>, IteratorResult<T>]>(
      (push, state = overIterator$start(iterate)) => {

        const [iterator] = state;
        let [, current] = state;

        while (!current.done) {

          const next = iterator.next();

          if (next.done) {
            push(current.value);
            break;
          }
          state[1] = next;

          const result = push(current.value, state);

          if (result != null) {
            return result;
          }

          current = next;
        }

        return false;
      },
      accept,
  ));
}

function overIterator$start<T>(iterate: (this: void) => Iterator<T>): [Iterator<T>, IteratorResult<T>] {

  const iterator = iterate();

  return [iterator, iterator.next()];
}
