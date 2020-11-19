/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
/**
 * Object property entry.
 *
 * This is a tuple consisting of property key and value.
 *
 * @typeParam TObj - Object type.
 * @typeParam TKey - A type of object property keys.
 */
export type ObjectEntry<TObj, TKey extends keyof TObj = keyof TObj> = readonly [TKey, TObj[TKey]];
