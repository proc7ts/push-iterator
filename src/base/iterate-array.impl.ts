import type { PushIterator } from '../push-iterator';
import { iterateIndexed } from './iterate-indexed.impl';

export function arrayElementOf<T>(array: ArrayLike<T>, index: number): T {
  return array[index];
}

export function iterateArray<T>(array: ArrayLike<T>, accept?: PushIterator.Acceptor<T>): PushIterator<T> {
  return iterateIndexed<ArrayLike<T>, T>(array, arrayElementOf, accept);
}
