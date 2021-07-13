import { isPushIterable, iteratorOf, makePushIterable, makePushIterator, pushHead } from '../base';
import { overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
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
  return makePushIterable(accept => {

    const forNext = isPushIterable(source) ? mapPusher(source, convert) : mapRawPusher(source, convert);

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  });
}

function mapPusher<TSrc, TConv>(
    source: PushIterable<TSrc>,
    convert: (this: void, element: TSrc) => TConv,
): PushIterator.Pusher<TConv> {
  return accept => {

    const tail = pushHead(source, element => accept(convert(element)));

    source = tail;

    return !tail.isOver();
  };
}

function mapRawPusher<TSrc, TConv>(
    source: Iterable<TSrc>,
    convert: (this: void, element: TSrc) => TConv,
): PushIterator.Pusher<TConv> {

  const it = iteratorOf(source);

  if (isPushIterable(it)) {
    return mapPusher(it, convert);
  }

  return accept => {
    for (; ;) {

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
