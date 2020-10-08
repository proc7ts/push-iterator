import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$iterate, PushIterator$iterator } from './make-push-iterator';

/**
 * @internal
 */
export function toPushIterator<T>(it: Iterator<T>, forNext: PushIterator.Pusher<T>): PushIterator<T> {

  let over = false;

  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol]: PushIterator$iterate(accept => {

      const hasMore = forNext(accept);

      over = !hasMore;

      return hasMore;
    }),
    next() {

      const next = it.next();

      over = !!next.done;

      return next;
    },
    isOver: () => over,
  };
}

/**
 * @internal
 */
export function rawIteratorPusher<T>(it: Iterator<T>): PushIterator.Pusher<T> {
  return (accept: PushIterator.Acceptor<T>): boolean => {
    for (; ;) {

      const res = it.next();

      if (res.done) {
        return false;
      }
      if (accept(res.value) === false) {
        return true;
      }
    }
  };
}
