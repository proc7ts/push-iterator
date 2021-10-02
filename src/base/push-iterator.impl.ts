import { PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';

export function PushIterator$iterator<T>(this: T): T {
  return this;
}

export function PushIterator$next<T>(this: PushIterator<T>): IteratorResult<T> {
  for (; ;) {

    let result: IteratorYieldResult<T> | undefined;
    const tail = this[PushIterator__symbol](
        value => {
          result = { value };

          return true;
        },
        PushIterationMode.Next,
    );

    if (result) {
      return result;
    }
    if (tail.isOver()) {
      return { done: true } as IteratorReturnResult<T>;
    }
  }
}
