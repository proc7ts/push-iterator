import type { PushOrRawIterable } from '../push-iterable';

/**
 * @internal
 */
export const flatMapIt$defaultConverter = <T, R>(element: T): PushOrRawIterable<R> => element as unknown as Iterable<R>;
