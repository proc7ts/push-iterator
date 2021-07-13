import { PushIterable, PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$iterator } from './push-iterator.impl';

/**
 * @internal
 */
export const PushIterator$empty: PushIterator<any> & PushIterable<any> = {
  [Symbol.iterator]: PushIterator$iterator,
  [PushIterator__symbol](
      _accept, // unused parameter to prevent deoptimization
  ) {
    return this;
  },
  next: () => ({ done: true } as IteratorReturnResult<unknown>),
  isOver: () => true,
};
