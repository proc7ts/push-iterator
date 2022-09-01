import type { CallChain, NextCall, NextSkip } from '@proc7ts/call-thru';

/**
 * A call chain transforming elements of iterable.
 *
 * Transformations performed when transformed element requested from final iterable.
 */
export interface IterableCallChain extends CallChain {
  /**
   * Calls a pass in this chain with each element of the given iterable.
   *
   * @typeParam T - Iterated elements type.
   * @param pass - A pass to call.
   * @param iterable - Source iterable.
   */
  iterate<T>(pass: (this: void, arg: T) => any, iterable: Iterable<T>): void;
}

export namespace IterableCallChain {
  export type Args<TReturn> = TReturn extends NextSkip<any>
    ? never
    : TReturn extends NextCall<IterableCallChain, infer A, any>
    ? A
    : [TReturn];

  export type Out<TReturn> = TReturn extends NextSkip<any>
    ? never
    : TReturn extends NextCall<IterableCallChain, any, infer A>
    ? A
    : TReturn;
}
