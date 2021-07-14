import type { Iterator } from 'typescript';
import type { PushIterator } from '../push-iterator';
import { iterateGenerated } from './iterate-generated';

export function iterateRaw<T>(iterate: () => Iterator<T>, accept?: PushIterator.Acceptor<T>): PushIterator<T> {
  return iterateGenerated<T, [Iterator<T>, IteratorResult<T>]>(
      (push, state = iterateRaw$start(iterate)): boolean | void => {

        // eslint-disable-next-line prefer-const
        let [iterator, current] = state;

        while (!current.done) {

          const next = iterator.next();

          state[1] = next;

          const result = push(current.value, state);

          if (next.done) {
            return false;
          }
          if (result != null) {
            return result;
          }

          current = next;
        }

        return false;
      },
      accept,
  );
}

function iterateRaw$start<T>(iterate: (this: void) => Iterator<T>): [Iterator<T>, IteratorResult<T>] {

  const iterator = iterate();

  return [iterator, iterator.next()];
}
