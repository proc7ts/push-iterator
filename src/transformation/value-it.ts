import { isPushIterable, iteratorOf, makePushIterable, makePushIterator, pushHead } from '../base';
import { overNone } from '../construction';
import type { PushIterable } from '../push-iterable';
import type { PushIterator } from '../push-iterator';

/**
 * Creates a {@link PushIterable | push iterable} with the values of elements of the `source` iterable.
 *
 * Element value is the result of provided function call, except `false`, `null`, and `undefined` which are filtered
 * out.
 *
 * This can be used as a more effective {@link mapIt} / {@link filterIt} combination.
 *
 * @typeParam T - A type of source elements.
 * @typeParam TValue - A type of source element values.
 * @param source - A source iterable.
 * @param valueOf - A function that values elements, taking the source element as the only parameter, and returning
 * either its value, or `false`/`null`/`undefined` to filter it out.
 *
 * @returns New push iterable with the element values.
 */
export function valueIt<T, TValue>(
    source: Iterable<T>,
    valueOf: (this: void, element: T) => TValue | false | null | undefined,
): PushIterable<TValue> {
  return makePushIterable(accept => {

    const forNext = isPushIterable(source) ? valuePusher(source, valueOf) : valueRawPusher(source, valueOf);

    return accept && !forNext(accept) ? overNone() : makePushIterator(forNext);
  });
}

/**
 * @internal
 */
function valuePusher<T, TValue>(
    source: PushIterable<T>,
    valueOf: (this: void, element: T) => TValue | false | null | undefined,
): PushIterator.Pusher<TValue> {
  return accept => {

    const tail = pushHead(
        source,
        element => {

          const value = valueOf(element);

          if (value != null && value !== false) {
            return accept(value);
          }
          return;
        },
    );

    source = tail;

    return !tail.isOver();
  };
}

/**
 * @internal
 */
function valueRawPusher<T, TValue>(
    source: Iterable<T>,
    valueOf: (this: void, element: T) => TValue | false | null | undefined,
): PushIterator.Pusher<TValue> {

  const it = iteratorOf(source);

  if (isPushIterable(it)) {
    return valuePusher(it, valueOf);
  }

  return accept => {
    for (; ;) {

      const next = it.next();

      if (next.done) {
        return false;
      }

      const value = valueOf(next.value);

      if (value != null && value !== false) {

        const status = accept(value);

        if (typeof status === 'boolean') {
          return status;
        }
      }
    }
  };
}
