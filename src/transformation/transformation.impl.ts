/**
 * @internal
 */
export const flatMapIt$defaultConverter = <T, R>(element: T): Iterable<R> => element as unknown as Iterable<R>;
