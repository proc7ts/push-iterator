import { PushIterator__symbol } from '../push-iterable';
import type { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';
import { PushIterator$iterator } from './push-iterator.impl';

export const PushIterator$empty: PushIterator<any> = {
  [Symbol.iterator]: PushIterator$iterator,
  [PushIterator__symbol](_accept, _mode) {
    return this;
  },
  next: PushIterator$noNext,
  isOver: PushIterator$over,
};

export function PushIterator$noNext<T>(): IteratorReturnResult<T> {
  return { done: true } as IteratorReturnResult<T>;
}

export function PushIterator$dontIterate<T>(
    _accept?: PushIterator.Acceptor<T>,
    _mode?: PushIterationMode,
): void {
  // Do not iterate
}

function PushIterator$over(): true {
  return true;
}
