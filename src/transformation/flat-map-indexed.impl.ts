import { makePushIterator } from '../base';
import type { Indexed$Elements } from '../base/indexed.impl';
import { iterateIt } from '../base/iterate-it';
import { PushIterator$empty } from '../base/push-iterator.empty.impl';
import type { PushIterable } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';

export function flatMapIndexed$<TIndexed extends Indexed$Elements, T>(
    indexed: TIndexed,
    elementsOf: (indexed: TIndexed, index: number) => Iterable<T>,
): PushIterable.Iterate<T> {
  return (accept, mode = PushIterationMode.Some) => {
    if (accept && mode > 0) {
      return flatMapIndexed$process(indexed, elementsOf, accept, mode);
    }

    let i = 0;
    let subs: Iterable<T> | undefined;

    const forNext = (accept: PushIterator.Acceptor<T>): boolean => {
      if (i >= indexed.length) {
        return false;
      }
      if (!subs) {
        subs = elementsOf(indexed, i);
      }

      for (; ;) {

        let status: boolean | void;
        const subsTail: PushIterator<T> = iterateIt<T>(
            subs,
            element => status = accept(element),
        );

        if (subsTail.isOver()) {
          if (++i >= indexed.length) {
            return false;
          }
          subs = elementsOf(indexed, i);
        } else {
          subs = subsTail;
        }

        if (typeof status === 'boolean') {
          return status;
        }
      }
    };

    return accept && !forNext(accept)
        ? PushIterator$empty
        : makePushIterator(forNext);
  };
}

function flatMapIndexed$process<TIndexed extends Indexed$Elements, T>(
    indexed: TIndexed,
    elementsOf: (indexed: TIndexed, index: number) => Iterable<T>,
    accept: PushIterator.Acceptor<T>,
    mode: PushIterationMode /* PushIterationMode.Only | PushIterationMode.All */,
): PushIterator<T> {
  if (mode === PushIterationMode.All) {
    for (let i = 0; i < indexed.length; ++i) {
      iterateIt(elementsOf(indexed, i), accept, mode);
    }
  } else {

    let status: boolean | void;
    const subProcess = (element: T): boolean | void => status = accept(element);

    for (let i = 0; i < indexed.length; ++i) {
      iterateIt(elementsOf(indexed, i), subProcess, mode);
      if (status === false) {
        break;
      }
    }
  }

  return PushIterator$empty;
}
