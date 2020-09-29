import type { PushIterable } from '../push-iterable';
import { overArray } from './over-array';
import { overNone } from './over-none';
import { overOne } from './over-one';

/**
 * Creates a {@link PushIterable push iterable} over many values.
 *
 * @typeParam T  Iterated elements value type.
 * @param values  Values to iterate over.
 *
 * @returns New push iterable over the given values.
 */
export function overMany<T>(...values: readonly T[]): PushIterable<T> {
  if (values.length > 1) {
    return overArray(values);
  }
  if (values.length) {
    return overOne(values[0]);
  }
  return overNone();
}
