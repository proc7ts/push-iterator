import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$iterate, PushIterator$iterator } from './push-iterator.impl';

/**
 * @internal
 */
export const noneIterator: PushIterator<any> & PushIterable<any> = {
  [Symbol.iterator]: PushIterator$iterator,
  [PushIterator__symbol]: PushIterator$iterate,
  next: () => ({ done: true } as IteratorReturnResult<unknown>),
  forNext: _accept /* Unused parameter to prevent deoptimization */ => false,
};
