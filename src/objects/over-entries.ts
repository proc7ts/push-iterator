import type { PushIterable } from '../push-iterable';
import { mapIt } from '../transformation';
import type { ObjectEntry } from './object-entry';
import { overKeys } from './over-keys';

/**
 * Creates a {@link PushIterable | push iterable} over the property key/value entries of the given object.
 *
 * A list of keys is constructed using `Reflect.ownKeys()`.
 *
 * @typeParam TObj - Object type.
 *
 * @param source - An object to select keys and values from.
 *
 * @returns New push iterable of object property entries.
 */
export function overEntries<TObj extends object>(source: TObj): PushIterable<ObjectEntry<TObj>> {
  return mapIt(overKeys(source), key => [key, source[key]]);
}
