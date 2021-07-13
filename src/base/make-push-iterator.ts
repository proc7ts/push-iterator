import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$dontIterate, PushIterator$iterator, PushIterator$next } from './push-iterator.impl';

/**
 * Creates a push iterator implementation.
 *
 * @typeParam T - Iterated elements type.
 * @param forNext - A function iterating over elements conforming to push iteration protocol.
 *
 * @returns New push iterator instance performing iteration by `forNext` function.
 */
export function makePushIterator<T>(forNext: PushIterator.Pusher<T>): PushIterator<T> {

  let over = false;
  let iterate = (accept?: PushIterator.Acceptor<T>): void => {
    if (accept && !forNext(accept)) {
      over = true;
      iterate = PushIterator$dontIterate;
    }
  };

  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol](accept) {
      iterate(accept);
      return this;
    },
    next: PushIterator$next,
    isOver: () => over,
  };
}
