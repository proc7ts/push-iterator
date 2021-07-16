import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { indexed$iterate, indexed$some } from './indexed.impl';

export function arrayLike$elementOf<T>(array: ArrayLike<T>, index: number): T {
  return array[index];
}

export function arrayLike$some<T>(array: ArrayLike<T>, accept: PushIterator.Acceptor<T>): PushIterator<T> {
  return indexed$some<ArrayLike<T>, T>(array, arrayLike$elementOf, accept);
}

export function arrayLike$iterate<T>(array: ArrayLike<T>): PushIterable.Iterate<T> {
  return indexed$iterate<ArrayLike<T>, T>(array, arrayLike$elementOf);
}
