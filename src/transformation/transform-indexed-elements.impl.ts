import { iterateGenerated, makePushIterable } from '../base';
import type { IndexedElements } from '../base/iterate-indexed.impl';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { transformIt$again } from './transform.impl';

export function transformIndexedElements<TIndexed extends IndexedElements, TSrc, TConv = TSrc, TState = void>(
    source: TIndexed,
    elementOf: (indexed: TIndexed, index: number) => TSrc,
    transform: PushIterator.Transformer<TSrc, TConv, TState>,
): PushIterable<TConv> {
  return makePushIterable(accept => iterateGenerated<TConv, IndexedElements$Transform<TState>>(
      (push, { i, st } = { i: 0 }): IndexedElements$Transform<TState> | false => {
        if (i >= source.length) {
          return false;
        }

        for (; ;) {

          const src = elementOf(source, i);
          const transformResult = transformNext(src);

          if (transformResult === false) {
            return false;
          }
          if (transformResult != null) {
            return { i, st };
          }
        }

        function transformNext(src: TSrc): boolean | void {
          for (; ;) {

            let pushResult!: boolean | void;

            const transformResult = transform(
                next => pushResult = push(next),
                src,
                st,
            );

            if (pushResult === false || transformResult === false) {
              // Abort transformation.
              return false;
            }

            st = transformResult;

            const reTransform = transformIt$again(transformResult);

            if (!reTransform && ++i >= source.length) {
              return false;
            }

            if (pushResult != null || !reTransform) {
              return pushResult;
            }
          }
        }
      },
      accept,
  ));
}

interface IndexedElements$Transform<TState> {
  i: number;
  st?: TState;
  re?: boolean;
}
