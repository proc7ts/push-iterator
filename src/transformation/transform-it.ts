import { iterateGenerated, iterateIt, makePushIterable } from '../base';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { transformIt$again } from './transform.impl';

/**
 * Creates a {@link PushIterable | push iterable} iterating over transformed elements of `source` iterable.
 *
 * @typeParam TSrc - A type of source elements.
 * @typeParam TConv - A type of converted elements.
 * @typeParam TState - Transformer's internal state type.
 * @param source - Source iterable to transform.
 * @param transform - Source elements transformer.
 *
 * @returns Transformed push iterable.
 *
 * @see {@link PushIterator.Transformer} for transformation algorithm description.
 */
export function transformIt<TSrc, TConv = TSrc, TState = void>(
    source: Iterable<TSrc>,
    transform: PushIterator.Transformer<TSrc, TConv, TState>,
): PushIterable<TConv> {
  return makePushIterable(accept => iterateGenerated<TConv, PushIterator$Transform<TSrc, TState>>(
      (
          push,
          [iterable, transformerState, reTransform, reSrc] = [source],
      ): false | PushIterator$Transform<TSrc, TState> => {
        if (reTransform) {

          const transformResult = transformNext(reSrc!);

          if (transformResult != null) {
            return transformResult ? [iterable, transformerState, reTransform, reSrc] : false;
          }
        }

        let transformResult!: boolean | void;
        const tail = iterateIt(iterable, (src: TSrc): boolean | void => transformResult = transformNext(src));

        if (transformResult === false || (!reTransform && tail.isOver())) {
          return false;
        }

        return [tail, transformerState, reTransform, reSrc];

        function transformNext(src: TSrc): boolean | void {
          reTransform = false;
          for (; ;) {

            let pushResult!: boolean | void;

            const transformResult: TState | false = transform(
                next => pushResult = push(next),
                src,
                transformerState,
            );

            if (pushResult === false || transformResult === false) {
              // Abort transformation.
              return false;
            }

            transformerState = transformResult;
            reTransform = transformIt$again(transformResult);

            if (reTransform) {
              reSrc = src;
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

type PushIterator$Transform<TSrc, TState> = [
  source: Iterable<TSrc>,
  transformerState?: TState,
  reTransform?: boolean,
  reSrc?: TSrc,
];
