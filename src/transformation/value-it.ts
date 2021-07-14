import type { PushIterable } from '../push-iterable';
import { transformIt } from './transform-it';

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
  return transformIt(
      source,
      (push, src): boolean | void => {

        const value = valueOf(src);

        if (value != null && value !== false && push(value) === false) {
          return false;
        }
      },
  );
}
