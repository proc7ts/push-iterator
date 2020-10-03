import type Benchmark from 'benchmark';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { mapIt } from '../transformation';
import { benchArray, benchIterable, benchOut } from './bench-data';
import { BenchFactory } from './bench-factory';

export function arrayMapSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of [...].map(...)',
          () => {
            for (const element of benchArray.map(el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of [...].slice().map(...)',
          () => {
            for (const element of benchArray.slice().map(el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of mapIterable([...])',
          () => {
            for (const element of mapIterable(benchArray, el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of *generatorMap([...])',
          () => {
            for (const element of generatorMap(benchArray, el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .add(
          'itsEach(mapIt([...]))',
          () => {
            itsEach(
                mapIt(benchArray, el => el + '!'),
                element => benchOut(element),
            );
          },
      )
      .suites('Array map', inputSizes.map(inputSize => [inputSize]));
}

export function iterableMapSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of mapIterable(iterable)',
          () => {
            for (const element of mapIterable(benchIterable(), el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of *generatorMap(iterable)',
          () => {
            for (const element of generatorMap(benchIterable(), el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .add(
          'itsEach(mapIt(iterable))',
          () => {
            itsEach(
                mapIt(benchIterable(), el => el + '!'),
                element => benchOut(element),
            );
          },
      )
      .add(
          'itsEach(mapIt(overArray([...])))',
          () => {
            itsEach(
                mapIt(overArray(benchArray), (el: string) => el + '!'),
                element => benchOut(element),
            );
          },
      )
      .suites('Iterable map', inputSizes.map(inputSize => [inputSize]));
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
