import { isPushIterable, makePushIterable, makePushIterator } from '../base';
import { iterateIt } from '../base/iterate-it';
import { overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Flattens the source iterable of iterables into new {@link PushIterable | push iterable}.
 *
 * Calling this function is the same as calling `flatMapIt(source, element => element)`.
 *
 * @typeParam T - A type of converted elements.
 * @param source - A source iterable of iterables.
 *
 * @returns New push iterable with each element of `source` being flattened.
 */
export function flatMapIt<T>(source: Iterable<Iterable<T>>): PushIterable<T>;

/**
 * First maps each element of the `source` iterable using a mapping function, then flattens the result into new
 * {@link PushIterable | push iterable}.
 *
 * @typeParam TSrc - A type of source elements.
 * @typeParam TConv - A type of converted elements.
 * @param source - A source iterable of elements to convert.
 * @param convert - A function that produces new iterable, taking the source element as the only parameter.
 *
 * @returns New push iterable with each element being the flattened result of the `convert` function call.
 */
export function flatMapIt<TSrc, TConv>(
    source: Iterable<TSrc>,
    convert: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterable<TConv>;

export function flatMapIt<TSrc, TConv>(
    source: Iterable<TSrc>,
    convert: (this: void, element: TSrc) => Iterable<TConv> = flatMapIt$defaultConverter,
): PushIterable<TConv> {
  return makePushIterable(accept => {

    const forNext = isPushIterable(source)
        ? flatMap$(source, convert)
        : flatMap$raw(source, convert);

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  });
}

function flatMap$<TSrc, TConv>(
    source: PushIterable<TSrc>,
    convert: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterator.Pusher<TConv> {

  let subs: Iterable<TConv> | undefined;
  let lastSrc = false;

  return accept => {
    for (; ;) {
      while (!subs) {

        const sourceTail = source[PushIterator__symbol](src => {
          subs = convert(src);
          return true;
        });

        source = sourceTail;

        if (sourceTail.isOver()) {
          if (!subs) {
            return false;
          }
          lastSrc = true;
        }
      }

      let status: boolean | void;
      const subsTail: PushIterator<TConv> = iterateIt(subs, element => status = accept(element));

      if (subsTail.isOver()) {
        subs = undefined;
        if (lastSrc) {
          return false;
        }
      } else {
        subs = subsTail;
      }

      if (typeof status === 'boolean') {
        return status;
      }
    }
  };
}

function flatMap$raw<TSrc, TConv>(
    source: Iterable<TSrc>,
    convert: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterator.Pusher<TConv> {

  const it = source[Symbol.iterator]();

  if (isPushIterable(it)) {
    return flatMap$(it, convert);
  }

  let subs: Iterable<TConv> | undefined;

  return accept => {
    for (; ;) {
      if (!subs) {

        const next = it.next();

        if (next.done) {
          return false;
        }

        subs = convert(next.value);
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let status: boolean | void;
      const subsTail: PushIterator<TConv> = iterateIt(subs, element => status = accept(element));

      subs = subsTail.isOver() ? undefined : subsTail;
      if (typeof status === 'boolean') {
        return status;
      }
    }
  };
}

function flatMapIt$defaultConverter<T, TConv>(
    element: T,
): Iterable<TConv> {
  return element as unknown as Iterable<TConv>;
}
