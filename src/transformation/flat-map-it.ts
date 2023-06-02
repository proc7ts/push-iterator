import { isPushIterable, makePushIterable, makePushIterator } from '../base';
import { iterateIt } from '../base/iterate-it';
import { PushIterator$empty } from '../base/push-iterator.empty.impl';
import { overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
import { PushIterator__symbol } from '../push-iterable';
import { PushIterationMode } from '../push-iteration-mode';
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
  return makePushIterable((accept, mode = PushIterationMode.Some) => {
    if (accept && mode > 0) {
      return isPushIterable(source)
        ? flatMapIt$process(source, convert, accept, mode)
        : flatMapIt$raw$process(source, convert, accept, mode);
    }

    const forNext = isPushIterable(source)
      ? flatMapIt$(source, convert)
      : flatMapIt$raw(source, convert);

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  });
}

function flatMapIt$<TSrc, TConv>(
  source: PushIterable<TSrc>,
  convert: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterator.Pusher<TConv> {
  let subs: Iterable<TConv> | undefined;
  let lastSrc = false;

  return accept => {
    for (;;) {
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

      let status: boolean | undefined | void;
      const subsTail: PushIterator<TConv> = iterateIt(subs, element => (status = accept(element)));

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

function flatMapIt$raw<TSrc, TConv>(
  source: Iterable<TSrc>,
  convert: (this: void, element: TSrc) => Iterable<TConv>,
): PushIterator.Pusher<TConv> {
  const it = source[Symbol.iterator]();

  if (isPushIterable(it)) {
    return flatMapIt$(it, convert);
  }

  let subs: Iterable<TConv> | undefined;

  return accept => {
    for (;;) {
      if (!subs) {
        const next = it.next();

        if (next.done) {
          return false;
        }

        subs = convert(next.value);
      }

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      let status: boolean | void | undefined;
      const subsTail: PushIterator<TConv> = iterateIt(subs, element => (status = accept(element)));

      subs = subsTail.isOver() ? undefined : subsTail;
      if (typeof status === 'boolean') {
        return status;
      }
    }
  };
}

function flatMapIt$process<TSrc, TConv>(
  source: PushIterable<TSrc>,
  convert: (this: void, element: TSrc) => Iterable<TConv>,
  accept: PushIterator.Acceptor<TConv>,
  mode: PushIterationMode,
): PushIterator<TConv> {
  if (mode === PushIterationMode.All) {
    source[PushIterator__symbol](src => iterateIt(convert(src), accept, mode));
  } else {
    let status: boolean | void;
    const subProcess = (element: TConv): boolean | void => (status = accept(element));

    source[PushIterator__symbol]((src: TSrc): false | void => {
      iterateIt(convert(src), subProcess, mode);
      if (status === false) {
        return false;
      }
    });
  }

  return PushIterator$empty;
}

function flatMapIt$raw$process<TSrc, TConv>(
  source: Iterable<TSrc>,
  convert: (this: void, element: TSrc) => Iterable<TConv>,
  accept: PushIterator.Acceptor<TConv>,
  mode: PushIterationMode,
): PushIterator<TConv> {
  if (mode === PushIterationMode.All) {
    for (const src of source) {
      iterateIt(convert(src), accept, mode);
    }
  } else {
    let status: boolean | void | undefined;
    const subProcess = (element: TConv): boolean | void => (status = accept(element));

    for (const src of source) {
      iterateIt(convert(src), subProcess, mode);
      if (status === false) {
        break;
      }
    }
  }

  return PushIterator$empty;
}

function flatMapIt$defaultConverter<T, TConv>(element: T): Iterable<TConv> {
  return element as unknown as Iterable<TConv>;
}
