import { iterateOver, makePushIterable } from '../base';
import type { IndexedElements } from '../base/iterate-over-indexed.impl';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { transformIt } from './transform-it';

export function transformIndexedElements<TIndexed extends IndexedElements, TSrc, TConv = TSrc, TState = void>(
    source: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => TSrc,
    transform: PushIterator.Transformer<TSrc, TConv, TState>,
): PushIterable<TConv> {
  return makePushIterable(accept => iterateOver<TConv, IndexedElements$Transform<TState>>(
      (push, state = [0]): boolean | void => {

        let [index, transformerState] = state;

        if (index >= source.length) {
          return false;
        }

        for (; ;) {

          const src = elementOf(source, index);
          const transformResult = transformNext(src);

          if (transformResult != null) {
            return transformResult;
          }
        }

        function transformNext(src: TSrc): boolean | void {
          for (; ;) {

            let pushResult!: boolean | void;

            const transformResult = transform(
                function pushTransformed(next, newState): boolean | void {
                  transformerState = state[1] = newState;
                  return pushResult = push(next, state);
                },
                src,
                transformerState,
            );

            if (pushResult === false || transformResult === false) {
              // Abort transformation.
              state = undefined;
              return false;
            }

            if (transformResult === transformIt) {
              // Transform the same element.
            } else {
              // Transform next element.
              if (++index >= source.length) {
                state = undefined;
                return false;
              }
              state[0] = index;
            }

            // Continue transformation.
            return pushResult;
          }
        }
      },
      accept,
  ));
}

type IndexedElements$Transform<TState> = [
  index: number,
  transformerState?: TState,
];
