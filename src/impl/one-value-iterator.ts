import type { PushIterator } from '../push-iterator';
import { PushIterator$iterator } from './push-iterator.impl';

/**
 * @internal
 */
export function oneValueIterator<T>(value: T): PushIterator<T> {

    let done = false;

    return {

        [Symbol.iterator]: PushIterator$iterator,

        next() {
            if (done) {
                return { done } as IteratorReturnResult<undefined>;
            }

            done = true;

            return { value };
        },

        forNext(accept) {
            if (!done) {
                done = true;
                accept(value);
            }

            return false;
        },
    };
}
