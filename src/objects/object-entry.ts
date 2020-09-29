/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator
 */
/**
 * Object property entry.
 *
 * This is a tuple consisting of property key and value.
 *
 * @typeParam T  Object type.
 * @typeParam K  A type of object property keys.
 */
export type ObjectEntry<T, K extends keyof T = keyof T> = readonly [K, T[K]];
