import { iterateGenerated, iterateIt, makePushIterable } from '../base';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

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
      (push, state = [source]): boolean | void => {

        // eslint-disable-next-line prefer-const
        let [source, transformerState, reTransform, reSrc] = state;

        if (reTransform) {

          const transformResult = transformNext(reSrc!);

          if (transformResult != null) {
            return transformResult;
          }
        }

        const tail = iterateIt(source, (src: TSrc): boolean | void => transformNext(src));

        if (tail.isOver()) {
          state = undefined;
          return false;
        }

        source = state[0] = tail;

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
              return false;
            }

            if (transformResult === transformIt) {
              // Transformation the same element.
              state[2 /* reTransform */] = 1;
              state[3 /* reSrc */] = src;
            } else {
              // Transform next element.
              state[2] = state[3] = undefined;
            }

            // Continue transformation.
            return pushResult;
          }
        }
      },
      accept,
  ));
}

type PushIterator$Transform<TSrc, TState> = [
  source: Iterable<TSrc>,
  transformerState?: TState,
  reTransform?: 0 | 1,
  reSrc?: TSrc,
];
