import type { Iterator } from 'typescript';
import type { PushIterator } from '../push-iterator';
import { iterateGenerated } from './iterate-generated';

export function iterateRaw<T>(iterate: () => Iterator<T>, accept?: PushIterator.Acceptor<T>): PushIterator<T> {
  return iterateGenerated<T, [Iterator<T>, IteratorResult<T>]>(
      (push, [iterator, current] = iterateRaw$start(iterate)): [Iterator<T>, IteratorResult<T>] | false => {
        while (!current.done) {

          const result = push(current.value);

          if (result === false) {
            return false;
          }

          const next = iterator.next();

          if (result != null) {
            return [iterator, next];
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
