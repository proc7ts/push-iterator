import { itsHead } from '../consumption';
import type { PushIterator } from '../push-iterator';
import { transformIt } from './transform-it';

export function flatMap$transformer<TSrc, TConv>(
    convert: (this: void, element: TSrc) => Iterable<TConv> = flatMap$defaultConverter,
): PushIterator.Transformer<TSrc, TConv, PushIterator$FlatMap<TConv>> {
  return (
      push,
      srcElement,
      state = [],
  ): boolean | typeof transformIt | void => {

    const [src = convert(srcElement)] = state;
    let pushResult!: boolean | void;

    const srcTail = itsHead(src, element => pushResult = push(element, state));

    if (pushResult === false) {
      // Abort processing.
      state = undefined;
      return false;
    }

    if (srcTail.isOver()) {
      // No more elements to process.
      // Continue from next src.
      state[0] = undefined;
      return pushResult ? true : undefined;
    }

    // More elements to process.
    state[0/* src */] = srcTail;

    // Re-process the same element.
    return transformIt;
  };
}

export type PushIterator$FlatMap<TConv> = [
  src?: Iterable<TConv>,
];

function flatMap$defaultConverter<T, TConv>(
    element: T,
): Iterable<TConv> {
  return element as unknown as Iterable<TConv>;
}
