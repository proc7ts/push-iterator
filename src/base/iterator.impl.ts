import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$dontIterate, PushIterator$noNext } from './push-iterator.empty.impl';
import { PushIterator$iterator } from './push-iterator.impl';

export function iterator$convert<T>(
  it: Iterator<T>,
  forNext: PushIterator.Pusher<T>,
): PushIterator<T> {
  let over = false;
  let iterate = (accept?: PushIterator.Acceptor<T>): void => {
    if ((over = !!accept && !forNext(accept))) {
      iterate = PushIterator$dontIterate;
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

export function iterator$pusher<T>(it: Iterator<T>): PushIterator.Pusher<T> {
  return accept => {
    for (;;) {
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
