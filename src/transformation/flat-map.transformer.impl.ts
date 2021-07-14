import { iterateIt } from '../base';
import type { PushIterator } from '../push-iterator';

export function flatMap$transformer<TSrc, TConv>(
    convert: (this: void, element: TSrc) => Iterable<TConv> = flatMap$defaultConverter,
): PushIterator.Transformer<TSrc, TConv, PushIterator$FlatMap<TConv> | undefined> {
  return (
      push,
      srcElement,
      {
        src = convert(srcElement),
      } = {},
  ): PushIterator$FlatMap<TConv> | undefined | false => {

    let pushResult!: boolean | void;

    const srcTail = iterateIt(src, element => pushResult = push(element));

    if (pushResult === false) {
      // Abort processing.
      return false;
    }
    if (srcTail.isOver()) {
      // No more elements to process.
      // Continue from next src.
      return;
    }

    // Re-process the same element.
    return { src: srcTail, re: true };
  };
}

export interface PushIterator$FlatMap<TConv> {
  src?: Iterable<TConv>;
  re?: boolean;
}

function flatMap$defaultConverter<T, TConv>(
    element: T,
): Iterable<TConv> {
  return element as unknown as Iterable<TConv>;
}
