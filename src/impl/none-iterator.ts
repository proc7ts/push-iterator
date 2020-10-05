import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$iterator } from './push-iterator.impl';

/**
 * @internal
 */
export const noneIterator: PushIterator<never> & PushIterable<never> = {
    [Symbol.iterator]: PushIterator$iterator,
    next: () => ({ done: true } as IteratorReturnResult<unknown>),
    forNext: _accept /* Unused parameter to prevent deoptimization */ => false,
};
