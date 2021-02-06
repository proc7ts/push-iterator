import { overArray } from '../construction';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable | push iterable} over keys of the given object.
 *
 * A list of keys is constructed using `Reflect.ownKeys()`.
 *
 * @typeParam TObj - Source object type.
 * @param source - An object to select keys from.
 *
 * @returns New push iterable over own object keys retrieved by `Reflect.ownKeys()`.
 */
export function overKeys<TObj extends object>(source: TObj): PushIterable<keyof TObj> {
  return overArray(Reflect.ownKeys(source) as (keyof TObj)[]);
}
