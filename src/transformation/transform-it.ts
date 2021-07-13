import { iterateOver, makePushIterable } from '../base';
import { itsHead } from '../consumption';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a {@link PushIterable | push iterable} iterating over transformed elements of original `iterable`.
 *
 * @typeParam TSrc - A type of source elements.
 * @typeParam TConv - A type of converted elements.
 * @typeParam TState - Transformer's internal state type.
 * @param iterable - A source iterable.
 * @param transform - Source elements transformer.
 *
 * @returns Transformed push iterable.
 *
 * @see {@link PushIterator.Transformer} for transformation algorithm description.
 */
export function transformIt<TSrc, TConv = TSrc, TState = void>(
    iterable: Iterable<TSrc>,
    transform: PushIterator.Transformer<TSrc, TConv, TState>,
): PushIterable<TConv> {
  return makePushIterable(accept => iterateOver<TConv, PushIterator$Transform<TSrc, TState>>(
      (push, state = [iterable]): boolean | void => {

        // eslint-disable-next-line prefer-const
        let [source, transformerState, reTransform, src] = state;

        if (reTransform) {

          const transformResult = transformNext(src!);

          if (transformResult != null) {
            return transformResult;
          }
        }

        const tail = itsHead(source, (src: TSrc): boolean | void => transformNext(src));

        if (tail.isOver()) {
          state = undefined;
          return false;
        }

        source = state[0] = tail;

        function transformNext(src: TSrc): boolean | void {
          reTransform = 0;
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
              return false;
            }

            if (transformResult === true) {
              reTransform = state[2] = 1;
              state[3] = src;
            } else {
              state[2] = state[3] = undefined;
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

type PushIterator$Transform<TSrc, TState> = [Iterable<TSrc>, TState?, (0 | 1)?, TSrc?];
