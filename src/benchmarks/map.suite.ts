import type Benchmark from 'benchmark';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { mapIt } from '../transformation';
import type { BenchContext } from './bench-context';
import { BenchFactory } from './bench-factory';

export function arrayMapSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of [...].map(...)',
          function (this: BenchContext) {
            for (const element of this.data.input.map(el => el + '!')) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of mapIterable([...])',
          function (this: BenchContext) {
            for (const element of mapIterable(this.data.input, el => el + '!')) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of *generatorMap([...])',
          function (this: BenchContext) {
            for (const element of generatorMap(this.data.input, el => el + '!')) {
              this.data.report(element);
            }
          },
      )
      .add(
          'itsEach(mapIt([...]))',
          function (this: BenchContext) {
            itsEach(
                mapIt(this.data.input, el => el + '!'),
                element => this.data.report(element),
            );
          },
      )
      .suites('Array map', inputSizes);
}

export function iterableMapSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of mapIterable(iterable)',
          function (this: BenchContext) {
            for (const element of mapIterable(this.data.iterable(), el => el + '!')) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of *generatorMap(iterable)',
          function (this: BenchContext) {
            for (const element of generatorMap(this.data.iterable(), el => el + '!')) {
              this.data.report(element);
            }
          },
      )
      .add(
          'itsEach(mapIt(iterable))',
          function (this: BenchContext) {
            itsEach(
                mapIt(this.data.iterable(), el => el + '!'),
                element => this.data.report(element),
            );
          },
      )
      .add(
          'itsEach(mapIt(overArray([...])))',
          function (this: BenchContext) {
            itsEach(
                mapIt(overArray(this.data.input), (el: string) => el + '!'),
                element => this.data.report(element),
            );
          },
      )
      .suites('Iterable map', inputSizes);
}

export function *generatorMap<T, R>(source: Iterable<T>, map: (src: T) => R): IterableIterator<R> {
  for (const src of source) {
    yield map(src);
  }
}

export function mapIterable<T, R>(source: Iterable<T>, map: (src: T) => R): Iterable<R> {
  return {
    [Symbol.iterator]() {

      const it = source[Symbol.iterator]();

      return {
        next() {

          const next = it.next();

          return next.done ? { done: true } as IteratorReturnResult<R> : { value: map(next.value) };
        },
      };
    },
  };
}
