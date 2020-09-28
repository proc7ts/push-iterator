import type Benchmark from 'benchmark';
import chalk from 'chalk';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { filterIt } from '../transformation';
import type { BenchContext } from './bench-context';
import { BenchData } from './bench-data';
import { BenchFactory } from './bench-factory';

export function arrayFilterSuite(
    rate: number,
    outOf: number,
    inputSizes: readonly number[],
): readonly Benchmark.Suite[] {
  return new FilterBenchFactory(rate, outOf)
      .add(
          'for ... of [...].filter(...)',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of this.data.input.filter(el => this.data.filter(el))) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of *generatorFilter([...])',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of generatorFilter(this.data.input, el => this.data.filter(el))) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of filterIterable([...])',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of filterIterable(this.data.input, el => this.data.filter(el))) {
              this.data.report(element);
            }
          },
      )
      .add(
          'itsEach(filterIt([...]))',
          function (this: BenchContext<FilterBenchData>) {
            itsEach(
                filterIt(
                    this.data.input,
                    el => this.data.filter(el),
                ),
                element => this.data.report(element),
            );
          },
      )
      .suites('Array filter', inputSizes);
}

export function iterableFilterSuite(
    rate: number,
    outOf: number,
    inputSizes: readonly number[],
): readonly Benchmark.Suite[] {
  return new FilterBenchFactory(rate, outOf)
      .add(
          'for ... of *generatorFilter(iterable)',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of generatorFilter(this.data.iterable(), el => this.data.filter(el))) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of filterIterable(iterable)',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of filterIterable(this.data.iterable(), el => this.data.filter(el))) {
              this.data.report(element);
            }
          },
      )
      .add(
          'itsEach(filterIt(overArray([...])))',
          function (this: BenchContext<FilterBenchData>) {
            itsEach(
                filterIt(
                    overArray(this.data.input),
                    el => this.data.filter(el),
                ),
                element => this.data.report(element),
            );
          },
      )
      .add(
          'itsEach(filterIt(iterable))',
          function (this: BenchContext<FilterBenchData>) {
            itsEach(
                filterIt(
                    this.data.iterable(),
                    el => this.data.filter(el),
                ),
                element => this.data.report(element),
            );
          },
      )
      .suites('Iterable filter', inputSizes);
}


export class FilterBenchData extends BenchData {

  private _filterIdx = 0;

  constructor(inputSize: number, readonly rate: number, readonly outOf: number) {
    super(inputSize, inputSize - Math.floor(inputSize * outOf / rate));
  }

  filter(element: string): boolean {
    if (++this._filterIdx > this.outOf) {
      this._filterIdx = 1;
    }
    return this._filterIdx > this.rate && !!element;
  }

}

export class FilterBenchFactory extends BenchFactory<FilterBenchData> {

  constructor(readonly rate: number, readonly outOf: number) {
    super((inputSize: number) => new FilterBenchData(inputSize, rate, outOf));
  }

  benchExtra(): string {
    return chalk.green(this.rate) + '/' + chalk.green(this.outOf) + ' out';
  }

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