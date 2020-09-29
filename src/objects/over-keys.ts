/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
import { overArray } from '../construction';
import type { PushIterable } from '../push-iterable';

/**
 * Creates a {@link PushIterable push iterable} over keys of the given object.
 *
 * A list of keys is constructed using `Reflect.ownKeys()`.
 *
 * @typeParam T  Source object type.
 * @param source  An object to select keys from.
 *
 * @returns New push iterable over own object keys retrieved by `Reflect.ownKeys()`.
 */
export function overKeys<T extends object>(source: T): PushIterable<keyof T> {
  return overArray(Reflect.ownKeys(source) as (keyof T)[]);
}
