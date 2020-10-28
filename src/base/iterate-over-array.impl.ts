import type { PushIterable } from '../push-iterable';
import { iterateOverIndexed } from './iterate-over-indexed.impl';

/**
 * @internal
 */
export function lengthOfArray<T>(array: ArrayLike<T>): number {
  return array.length;
}

/**
 * @internal
 */
function elementOfArray<T>(array: ArrayLike<T>, index: number): T {
  return array[index];
}

/**
 * @internal
 */
export function iterateOverArray<T>(array: ArrayLike<T>): PushIterable.Iterate<T> {
  return iterateOverIndexed<ArrayLike<T>, T>(array, elementOfArray, lengthOfArray);
}
