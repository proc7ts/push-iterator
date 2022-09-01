import { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';
import { PushIterator$empty } from './push-iterator.empty.impl';

export function iterable$process<T, TOut = T>(
  iterable: Iterable<T>,
  accept: PushIterator.Acceptor<T>,
  mode: PushIterationMode /* PushIterationMode.Only | PushIterationMode.All */,
): PushIterator<TOut> {
  if (mode === PushIterationMode.All) {
    for (const element of iterable) {
      accept(element);
    }
  } else {
    for (const element of iterable) {
      if (accept(element) === false) {
        break;
      }
    }
  }

  return PushIterator$empty;
}
