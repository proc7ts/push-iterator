/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator/call-thru
 */
import { NextCall, nextCall } from '@proc7ts/call-thru';
import type { PushIterable } from '../push-iterable';
import type { IterableCallChain } from './iterable-call-chain';

/**
 * Creates a next call in {@link IterableCallChain iterable call chain} that performs the next passes for each
 * element of the given iterable.
 *
 * This call passes elements to the next call on demand, while the `nextEach()` one transforms them all at once,
 * and iterates over results after that.
 *
 * @typeParam T  Iterated elements type.
 * @param iterable  An iterable containing elements to pass down the chain.
 *
 * @returns Next call for iterable call chain.
 */
export function nextIterate<T>(iterable: Iterable<T> | PushIterable<T>): NextCall<IterableCallChain, [T], T> {
  return nextCall((chain, pass) => chain.iterate(pass, iterable));
}
