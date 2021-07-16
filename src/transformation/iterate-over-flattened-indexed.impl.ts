import { makePushIterator } from '../base';
import type { Indexed$Elements } from '../base/indexed.impl';
import { iterateIt } from '../base/iterate-it';
import { overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

export function iterateOverFlattenedIndexed<TIndexed extends Indexed$Elements, T>(
    indexed: TIndexed,
    elementsOf: (indexed: TIndexed, index: number) => Iterable<T>,
): PushIterable.Iterate<T> {
  return accept => {

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
        const subsTail: PushIterator<T> = iterateIt<T>(subs, element => status = accept(element));

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

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  };
}
