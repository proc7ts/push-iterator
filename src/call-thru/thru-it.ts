/**
 * @packageDocumentation
 * @module @proc7ts/push-iterator/call-thru
 */
import { isNextCall, NextCall__symbol } from '@proc7ts/call-thru';
import { overElementsOf, overOne } from '../construction';
import type { PushIterable } from '../push-iterable';
import { flatMapIt } from '../transformation';
import type { IterableCallChain } from './iterable-call-chain';

type Args<TReturn> = IterableCallChain.Args<TReturn>;
type Out<TReturn> = IterableCallChain.Out<TReturn>;

/**
 * Passes each element of the given iterable trough the {@link IterableCallChain chain of transformation passes}.
 *
 * The passes are preformed by `@proc7ts/call-thru`.
 *
 * @returns An push iterable of transformed elements.
 */
export function thruIt<
    T, TReturn1
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
): PushIterable<Out<TReturn1>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
): PushIterable<Out<TReturn2>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
): PushIterable<Out<TReturn3>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
): PushIterable<Out<TReturn4>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    TArgs5 extends Args<TReturn4>, TReturn5,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
    pass5: (this: void, ...args: TArgs5) => TReturn5,
): PushIterable<Out<TReturn4>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    TArgs5 extends Args<TReturn4>, TReturn5,
    TArgs6 extends Args<TReturn5>, TReturn6,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
    pass5: (this: void, ...args: TArgs5) => TReturn5,
    pass6: (this: void, ...args: TArgs6) => TReturn6,
): PushIterable<Out<TReturn4>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    TArgs5 extends Args<TReturn4>, TReturn5,
    TArgs6 extends Args<TReturn5>, TReturn6,
    TArgs7 extends Args<TReturn6>, TReturn7,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
    pass5: (this: void, ...args: TArgs5) => TReturn5,
    pass6: (this: void, ...args: TArgs6) => TReturn6,
    pass7: (this: void, ...args: TArgs7) => TReturn7,
): PushIterable<Out<TReturn4>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    TArgs5 extends Args<TReturn4>, TReturn5,
    TArgs6 extends Args<TReturn5>, TReturn6,
    TArgs7 extends Args<TReturn6>, TReturn7,
    TArgs8 extends Args<TReturn7>, TReturn8,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
    pass5: (this: void, ...args: TArgs5) => TReturn5,
    pass6: (this: void, ...args: TArgs6) => TReturn6,
    pass7: (this: void, ...args: TArgs7) => TReturn7,
    pass8: (this: void, ...args: TArgs8) => TReturn8,
): PushIterable<Out<TReturn4>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    TArgs5 extends Args<TReturn4>, TReturn5,
    TArgs6 extends Args<TReturn5>, TReturn6,
    TArgs7 extends Args<TReturn6>, TReturn7,
    TArgs8 extends Args<TReturn7>, TReturn8,
    TArgs9 extends Args<TReturn8>, TReturn9,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
    pass5: (this: void, ...args: TArgs5) => TReturn5,
    pass6: (this: void, ...args: TArgs6) => TReturn6,
    pass7: (this: void, ...args: TArgs7) => TReturn7,
    pass8: (this: void, ...args: TArgs8) => TReturn8,
    pass9: (this: void, ...args: TArgs9) => TReturn9,
): PushIterable<Out<TReturn4>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    TArgs5 extends Args<TReturn4>, TReturn5,
    TArgs6 extends Args<TReturn5>, TReturn6,
    TArgs7 extends Args<TReturn6>, TReturn7,
    TArgs8 extends Args<TReturn7>, TReturn8,
    TArgs9 extends Args<TReturn8>, TReturn9,
    TArgs10 extends Args<TReturn9>, TReturn10,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
    pass5: (this: void, ...args: TArgs5) => TReturn5,
    pass6: (this: void, ...args: TArgs6) => TReturn6,
    pass7: (this: void, ...args: TArgs7) => TReturn7,
    pass8: (this: void, ...args: TArgs8) => TReturn8,
    pass9: (this: void, ...args: TArgs9) => TReturn9,
    pass10: (this: void, ...args: TArgs10) => TReturn10,
): PushIterable<Out<TReturn4>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    TArgs5 extends Args<TReturn4>, TReturn5,
    TArgs6 extends Args<TReturn5>, TReturn6,
    TArgs7 extends Args<TReturn6>, TReturn7,
    TArgs8 extends Args<TReturn7>, TReturn8,
    TArgs9 extends Args<TReturn8>, TReturn9,
    TArgs10 extends Args<TReturn9>, TReturn10,
    TArgs11 extends Args<TReturn10>, TReturn11,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
    pass5: (this: void, ...args: TArgs5) => TReturn5,
    pass6: (this: void, ...args: TArgs6) => TReturn6,
    pass7: (this: void, ...args: TArgs7) => TReturn7,
    pass8: (this: void, ...args: TArgs8) => TReturn8,
    pass9: (this: void, ...args: TArgs9) => TReturn9,
    pass10: (this: void, ...args: TArgs10) => TReturn10,
    pass11: (this: void, ...args: TArgs11) => TReturn11,
): PushIterable<Out<TReturn4>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    TArgs5 extends Args<TReturn4>, TReturn5,
    TArgs6 extends Args<TReturn5>, TReturn6,
    TArgs7 extends Args<TReturn6>, TReturn7,
    TArgs8 extends Args<TReturn7>, TReturn8,
    TArgs9 extends Args<TReturn8>, TReturn9,
    TArgs10 extends Args<TReturn9>, TReturn10,
    TArgs11 extends Args<TReturn10>, TReturn11,
    TArgs12 extends Args<TReturn11>, TReturn12,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
    pass5: (this: void, ...args: TArgs5) => TReturn5,
    pass6: (this: void, ...args: TArgs6) => TReturn6,
    pass7: (this: void, ...args: TArgs7) => TReturn7,
    pass8: (this: void, ...args: TArgs8) => TReturn8,
    pass9: (this: void, ...args: TArgs9) => TReturn9,
    pass10: (this: void, ...args: TArgs10) => TReturn10,
    pass11: (this: void, ...args: TArgs11) => TReturn11,
    pass12: (this: void, ...args: TArgs12) => TReturn12,
): PushIterable<Out<TReturn4>>;

export function thruIt<
    T, TReturn1,
    TArgs2 extends Args<TReturn1>, TReturn2,
    TArgs3 extends Args<TReturn2>, TReturn3,
    TArgs4 extends Args<TReturn3>, TReturn4,
    TArgs5 extends Args<TReturn4>, TReturn5,
    TArgs6 extends Args<TReturn5>, TReturn6,
    TArgs7 extends Args<TReturn6>, TReturn7,
    TArgs8 extends Args<TReturn7>, TReturn8,
    TArgs9 extends Args<TReturn8>, TReturn9,
    TArgs10 extends Args<TReturn9>, TReturn10,
    TArgs11 extends Args<TReturn10>, TReturn11,
    TArgs12 extends Args<TReturn11>, TReturn12,
    TArgs13 extends Args<TReturn12>, TReturn13,
    >(
    it: Iterable<T> | PushIterable<T>,
    pass1: (this: void, arg: T) => TReturn1,
    pass2: (this: void, ...args: TArgs2) => TReturn2,
    pass3: (this: void, ...args: TArgs3) => TReturn3,
    pass4: (this: void, ...args: TArgs4) => TReturn4,
    pass5: (this: void, ...args: TArgs5) => TReturn5,
    pass6: (this: void, ...args: TArgs6) => TReturn6,
    pass7: (this: void, ...args: TArgs7) => TReturn7,
    pass8: (this: void, ...args: TArgs8) => TReturn8,
    pass9: (this: void, ...args: TArgs9) => TReturn9,
    pass10: (this: void, ...args: TArgs10) => TReturn10,
    pass11: (this: void, ...args: TArgs11) => TReturn11,
    pass12: (this: void, ...args: TArgs12) => TReturn12,
    pass13: (this: void, ...args: TArgs13) => TReturn13,
): PushIterable<Out<TReturn4>>;

export function thruIt<T, TReturn>(
    it: Iterable<T> | PushIterable<T>,
    ...passes: ((...args: any[]) => any)[]
): PushIterable<TReturn> {

  const chain = (outcome: PushIterable<any>[], index: number): IterableCallChain => {

    const lastPass = index >= passes.length;

    ++index;

    const pass = index < passes.length ? passes[index] : () => { /* empty pass */ };
    const handleResult = (outcome: PushIterable<any>[], callResult: any, arg: any): void => {
      if (isNextCall(callResult)) {
        callResult[NextCall__symbol](chain(outcome, index), pass);
      } else if (lastPass) {
        outcome.push(overOne(arg));
      } else {
        chain(outcome, index).pass(pass, callResult);
      }
    };

    return ({
      call<A extends any[]>(fn: (...args: A) => any, args: A): void {
        handleResult(outcome, fn(...args), args);
      },
      pass<A>(fn: (arg: A) => any, arg: A): void {
        handleResult(outcome, fn(arg), arg);
      },
      skip() {/* skip item */},
      iterate<I>(fn: (this: void, arg: I) => void, iterable: Iterable<I>): void {
        outcome.push(flatMapIt(
            iterable,
            item => {

              const itemOutcome: PushIterable<any>[] = [];

              handleResult(itemOutcome, fn(item), item);

              return overElementsOf(...itemOutcome);
            },
        ));
      },
    });
  };

  const finalOutcome: PushIterable<any>[] = [];

  chain(finalOutcome, 0).iterate(passes[0], it);

  return overElementsOf<TReturn>(...finalOutcome);
}
