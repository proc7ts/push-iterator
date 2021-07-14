import { PushIterator__symbol } from '../push-iterable';
import type { PushIterator } from '../push-iterator';
import { PushIterator$empty } from './push-iterator.empty.impl';
import { PushIterator$dontIterate, PushIterator$iterator, PushIterator$noNext } from './push-iterator.impl';

/**
 * Iterates over generated elements.
 *
 * Calling this function with `accept` parameter specified starts iteration instantly. When `accept` parameter omitted
 * the function just creates a new iterator.
 *
 * @param generator - Elements generator.
 * @param accept - A function to push iterated elements to. Accepts iterated element as its only parameter. May return
 * `true` to suspend iteration, or `false` to stop it.
 *
 * @returns A push iterator instance to continue iteration with. If `accept` returned `false` then further iteration
 * won't be possible with returned iterator.
 *
 * @see {@link PushIterator.Generator} for iteration algorithm description.
 */
export function iterateGenerated<T, TState>(
    generator: PushIterator.Generator<T, TState>,
    accept?: PushIterator.Acceptor<T>,
): PushIterator<T> {

  let over = false;
  let state: TState | undefined;
  let doIterate = (accept: PushIterator.Acceptor<T>): void => {

    let pushed = false;
    let push = (next: T, newState = state): boolean | void => {

      const result = accept(next);

      pushed = true;

      if (result === false) {
        // Stop iteration.
        state = undefined;
        over = true;
        doIterate = PushIterator$dontIterate;
        accept = push = PushIterator$reject;

        return false;
      }

      state = newState;

      if (result === true) {
        // Suspend iteration.
        return true;
      }

      // Continue iteration.
    };

    if (generator(push, state) === false || !pushed) {
      state = undefined;
      over = true;
      doIterate = PushIterator$dontIterate;
      accept = push = PushIterator$reject;
    }
  };

  if (accept) {
    doIterate(accept);
    if (over) {
      return PushIterator$empty;
    }
  }

  let next = (): IteratorResult<T> => {

    let result: IteratorYieldResult<T> | undefined;

    doIterate(value => {
      result = { value };
      return true;
    });

    if (over) {
      next = PushIterator$noNext;
    }
    if (result) {
      return result;
    }

    return { done: true } as IteratorReturnResult<T>;
  };

  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol](accept) {
      if (accept) {
        doIterate(accept);
      }
      return this;
    },
    next: () => next(),
    isOver: () => over,
  };
}

function PushIterator$reject<T, TState>(_next: T, _newState?: TState): boolean {
  return false;
}
