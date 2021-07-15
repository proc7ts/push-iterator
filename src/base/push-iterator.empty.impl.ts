import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$iterator } from './push-iterator.impl';

export const PushIterator$empty: PushIterator<any> = {
  [Symbol.iterator]: PushIterator$iterator,
  [PushIterator__symbol](
      _accept, // unused parameter to prevent deoptimization
  ) {
    return this;
  },
  next: PushIterator$noNext,
  isOver: PushIterator$over,
};

export function PushIterator$noNext<T>(): IteratorReturnResult<T> {
  return { done: true } as IteratorReturnResult<T>;
}

export function PushIterator$dontIterate<T>(
    _accept?: PushIterator.Acceptor<T>, // unused parameter to prevent deoptimization
): void {
  // Do not iterate
}

function PushIterator$over(): true {
  return true;
}
