import { makePushIterable } from '../base';
import type { PushIterable } from '../push-iterable';
import { flatMapIndexed$ } from './flat-map-indexed.impl';

export function flatMapArray$<TSrc, TConv>(
    array: ArrayLike<TSrc>,
    elementsOf: (indexed: ArrayLike<TSrc>, index: number) => Iterable<TConv>,
): PushIterable<TConv> {
  return makePushIterable(flatMapIndexed$<ArrayLike<TSrc>, TConv>(array, elementsOf));
}

export function flatMapArray$defaultElementOf<TSrc, TConv>(
    array: ArrayLike<TSrc>,
    index: number,
): Iterable<TConv> {
  return array[index] as unknown as Iterable<TConv>;
}
