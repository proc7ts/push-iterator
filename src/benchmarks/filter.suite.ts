import type Benchmark from 'benchmark';
import chalk from 'chalk';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { filterIt } from '../transformation';
import { benchArray, benchIterable, benchOut, benchSetup } from './bench-data';
import { BenchFactory } from './bench-factory';

export function arrayFilterSuite(
    rate: number,
    outOf: number,
    inputSizes: readonly number[],
): readonly Benchmark.Suite[] {
  return new FilterBenchFactory()
      .add(
          'for ... of [...].filter(...)',
          () => {
            for (const element of benchArray.filter(el => benchFilter(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of *generatorFilter([...])',
          () => {
            for (const element of generatorFilter(benchArray, el => benchFilter(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of filterIterable([...])',
          () => {
            for (const element of filterIterable(benchArray, el => benchFilter(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'itsEach(filterIt([...]))',
          () => {
            itsEach(
                filterIt(
                    benchArray,
                    el => benchFilter(el),
                ),
                element => benchOut(element),
            );
          },
      )
      .suites('Array filter', inputSizes.map(inputSize => [inputSize, rate, outOf]));
}

export function iterableFilterSuite(
    rate: number,
    outOf: number,
    inputSizes: readonly number[],
): readonly Benchmark.Suite[] {
  return new FilterBenchFactory()
      .add(
          'for ... of *generatorFilter(iterable)',
          () => {
            for (const element of generatorFilter(benchIterable(), el => benchFilter(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of filterIterable(iterable)',
          () => {
            for (const element of filterIterable(benchIterable(), el => benchFilter(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'itsEach(filterIt(overArray([...])))',
          () => {
            itsEach(
                filterIt(
                    overArray(benchArray),
                    el => benchFilter(el),
                ),
                element => benchOut(element),
            );
          },
      )
      .add(
          'itsEach(filterIt(iterable))',
          () => {
            itsEach(
                filterIt(
                    benchIterable(),
                    el => benchFilter(el),
                ),
                element => benchOut(element),
            );
          },
      )
      .suites('Iterable filter', inputSizes.map(inputSize => [inputSize, rate, outOf]));
}


export class FilterBenchFactory extends BenchFactory<[inputSize: number, rate: number, outOf: number]> {

  constructor() {
    super(benchSetupFilter);
  }

  benchExtra(_inputSize: number, rate: number, outOf: number): string {
    return chalk.green(rate) + '/' + chalk.green(outOf) + ' out';
  }

}

let benchFilterIndex = 0;
let benchRate = 1;
let benchOutOf = 10;

export function benchFilter(element: string): boolean {
  if (++benchFilterIndex > benchOutOf) {
    benchFilterIndex = 1;
  }
  return benchFilterIndex > benchRate && !!element;
}

export function benchSetupFilter(inputSize: number, rate: number, outOf: number): void {
  benchSetup(inputSize);
  benchFilterIndex = 0;
  benchRate = rate;
  benchOutOf = outOf;
}

export function *generatorFilter<T>(source: Iterable<T>, filter: (element: T) => boolean): IterableIterator<T> {
  for (const element of source) {
    if (filter(element)) {
      yield element;
    }
  }
}

export function filterIterable<T>(source: Iterable<T>, filter: (element: T) => boolean): Iterable<T> {
  return {
    [Symbol.iterator]() {

      const it = source[Symbol.iterator]();

      return {
        next() {
          for (;;) {

            const { done, value } = it.next();

            if (done) {
              return { done, value: undefined };
            }
            if (filter(value)) {
              return { value };
            }
          }
        },
      };
    },
  };
}
