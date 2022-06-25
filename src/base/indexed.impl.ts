import type { IndexedItemList } from '../construction';
import { PushIterable, PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';
import { PushIterator$dontIterate, PushIterator$empty, PushIterator$noNext } from './push-iterator.empty.impl';
import { PushIterator$iterator } from './push-iterator.impl';

export interface Indexed$Elements {

  readonly length: number;

}

export function indexed$itemOf<T>(indexed: IndexedItemList<T>, index: number): T {
  return indexed.item(index) as T; // The index is always valid.
}

export function indexed$process<TIndexed extends Indexed$Elements, T, TOut = T>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => T,
    accept: PushIterator.Acceptor<T>,
    mode: PushIterationMode /* PushIterationMode.Only | PushIterationMode.All */,
): PushIterator<TOut> {
  if (mode === PushIterationMode.All) {
    for (let i = 0; i < indexed.length; ++i) {
      accept(elementOf(indexed, i));
    }
  } else {
    for (let i = 0; i < indexed.length; ++i) {
      if (accept(elementOf(indexed, i)) === false) {
        break;
      }
    }
  }

  return PushIterator$empty;
}

export function indexed$some<TIndexed extends Indexed$Elements, T>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => T,
    accept?: PushIterator.Acceptor<T>,
): PushIterator<T> {

  let i = 0;
  const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
    if (i >= indexed.length) {
      return false;
    }
    for (; ;) {

      const goOn = accept(elementOf(indexed, i++));

      if (i >= indexed.length || goOn === false) {
        return false;
      }
      if (goOn === true) {
        return true;
      }
    }
  };

  if (accept && !forNext(accept)) {
    return PushIterator$empty;
  }

  let over = false;
  let iterate = (accept?: PushIterator.Acceptor<T>): void => {
    if (accept && !forNext(accept)) {
      over = true;
      iterate = PushIterator$dontIterate;
      next = PushIterator$noNext;
    }
  };
  let next = (): IteratorResult<T> => {
    if (i < indexed.length) {
      return { value: elementOf(indexed, i++) };
    }

    over = true;
    iterate = PushIterator$dontIterate;
    next = PushIterator$noNext;

    return { done: true } as IteratorReturnResult<T>;
  };

  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol](accept) {
      iterate(accept);

      return this;
    },
    next: () => next(),
    isOver: () => over,
  };
}

export function indexed$iterate<TIndexed extends Indexed$Elements, T>(
    indexed: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => T,
): PushIterable.Iterate<T> {
  return (
      accept?: PushIterator.Acceptor<T>,
      mode: PushIterationMode = PushIterationMode.Some,
  ): PushIterator<T> => accept && mode > 0
      ? indexed$process(indexed, elementOf, accept, mode)
      : indexed$some(indexed, elementOf, accept);
}
