import type { PushIterator } from '../push-iterator';
import { PushIterator$iterator } from './push-iterator.impl';

/**
 * @internal
 */
export function toPushIterator<T>(it: Iterator<T>): PushIterator<T> {
    return {

        [Symbol.iterator]: PushIterator$iterator,

        next: () => it.next(),

        forNext(accept) {
            for (; ;) {

                const res = it.next();

                if (res.done) {
                    return false;
                }
                if (accept(res.value) === false) {
                    return true;
                }
            }
        },

    };
}
