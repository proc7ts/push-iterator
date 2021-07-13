import type { PushIterator } from '../push-iterator';
import { iterateOverIndexed } from './iterate-over-indexed.impl';

export function arrayElementOf<T>(array: ArrayLike<T>, index: number): T {
  return array[index];
}

export function iterateOverArray<T>(array: ArrayLike<T>, accept?: PushIterator.Acceptor<T>): PushIterator<T> {
  return iterateOverIndexed<ArrayLike<T>, T>(array, arrayElementOf, accept);
}
