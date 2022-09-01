import { isPushIterable, makePushIterable, makePushIterator } from '../base';
import { iterable$process } from '../base/iterable.impl';
import { overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a {@link PushIterable | push iterable} with the results of calling a provided function on every element
 * of the `source` iterable.
 *
 * @typeParam TSrc - A type of source elements.
 * @typeParam TConv - A type of converted elements.
 * @param source - A source iterable.
 * @param convert - A function that produces an element of the new iterable, taking the source element as the only
 * parameter.
 *
 * @returns New push iterable of transformed elements.
 */
export function mapIt<TSrc, TConv>(
  source: Iterable<TSrc>,
  convert: (this: void, element: TSrc) => TConv,
): PushIterable<TConv> {
  return makePushIterable((accept, mode = PushIterationMode.Some) => {
    if (accept && mode > 0) {
      const acceptElement = (element: TSrc): boolean | void => accept(convert(element));

      return isPushIterable(source)
        ? (source[PushIterator__symbol](acceptElement, mode) as PushIterator<never>) // Iteration over.
        : iterable$process<TSrc, TConv>(source, acceptElement, mode);
    }

    const forNext = isPushIterable(source) ? mapIt$(source, convert) : mapIt$raw(source, convert);

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  });
}

function mapIt$<TSrc, TConv>(
  source: PushIterable<TSrc>,
  convert: (this: void, element: TSrc) => TConv,
): PushIterator.Pusher<TConv> {
  return accept => !(source = source[PushIterator__symbol](element => accept(convert(element)))).isOver();
}

function mapIt$raw<TSrc, TConv>(
  source: Iterable<TSrc>,
  convert: (this: void, element: TSrc) => TConv,
): PushIterator.Pusher<TConv> {
  const it = source[Symbol.iterator]();

  if (isPushIterable(it)) {
    return mapIt$(it, convert);
  }

  return accept => {
    for (;;) {
      const next = it.next();

      if (next.done) {
        return false;
      }

      const status = accept(convert(next.value));

      if (typeof status === 'boolean') {
        return status;
      }
    }
  };
}
