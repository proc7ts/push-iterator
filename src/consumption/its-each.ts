import { iterateIt } from '../base';

/**
 * Performs the given `action` for each element of the given `iterable`.
 *
 * @typeParam T - Iterated elements type.
 * @param iterable - An iterable of elements to perform actions on.
 * @param action - An action to perform on each iterable element. This is a function accepting an element as its only
 * parameter.
 */
export function itsEach<T>(iterable: Iterable<T>, action: (this: void, element: T) => void): void {
  iterateIt(iterable, element => { action(element); });
}
