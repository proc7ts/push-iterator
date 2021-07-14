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
 * @returns Push iterator instance to continue iteration with. If `accept` returned `false` then further iteration
 * won't be possible with returned iterator.
 *
 * @see {@link PushIterator.Generator} for iteration algorithm description.
 */
export function iterateGenerated<T, TState = void>(
    generator: PushIterator.Generator<T, TState>,
    accept?: PushIterator.Acceptor<T>,
): PushIterator<T> {

  let over = false;
  let state: TState | undefined;
  let doGenerate = generateNext;

  if (accept) {
    doGenerate(accept);
    if (over) {
      return PushIterator$empty;
    }
  }

  let next = pullNext;

  return {
    [Symbol.iterator]: PushIterator$iterator,
    [PushIterator__symbol](accept) {
      if (accept) {
        doGenerate(accept);
      }
      return this;
    },
    next: () => next(),
    isOver: () => over,
  };

  function generateNext(accept: PushIterator.Acceptor<T>): void {

    let pushed: 0 | 1 = 0;
    let push = (next: T): boolean | void => {

      const accepted = accept(next);

      pushed = 1;

      if (accepted === false) {
        // Stop iteration.
        state = undefined;
        over = true;
        doGenerate = PushIterator$dontIterate;
        accept = push = PushIterator$reject;

        return false;
      }
      if (accepted === true) {
        // Suspend iteration.
        return true;
      }

      // Continue iteration.
    };

    const result = generator(push, state);

    if (result === false || !pushed) {
      state = undefined;
      over = true;
      doGenerate = PushIterator$dontIterate;
      accept = push = PushIterator$reject;
    } else {
      state = result;
    }
  }

  function pullNext(): IteratorResult<T> {

    let result: IteratorYieldResult<T> | undefined;

    doGenerate(value => {
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
  }
}

function PushIterator$reject<T>(_next: T): boolean {
  return false;
}
