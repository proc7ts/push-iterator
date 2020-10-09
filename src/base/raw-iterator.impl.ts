import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$dontIterate, PushIterator$iterator, PushIterator$noNext } from './make-push-iterator';

/**
 * @internal
 */
export function toPushIterator<T>(it: Iterator<T>, forNext: PushIterator.Pusher<T>): PushIterator<T> {

  let over = false;
  let iterate = (accept?: PushIterator.Acceptor<T>): void => {
    if ((over = !!accept && !forNext(accept))) {
      iterate = PushIterator$dontIterate;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      next = PushIterator$noNext;
    }
  };
  let next = (): IteratorResult<T> => {

    const res = it.next();

    if (res.done) {
      over = true;
      iterate = PushIterator$dontIterate;
      next = PushIterator$noNext;
    }

    return res;
  };

  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol](accept) {
      iterate(accept);
      return this;
    },
    next() {
      return next();
    },
    isOver: () => over,
  };
}

/**
 * @internal
 */
export function rawIteratorPusher<T>(it: Iterator<T>): PushIterator.Pusher<T> {
  return accept => {
    for (; ;) {

      const res = it.next();

      if (res.done) {
        return false;
      }

      const status = accept(res.value);

      if (typeof status === 'boolean') {
        return status;
      }
    }
  };
}
