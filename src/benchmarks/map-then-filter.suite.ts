import type Benchmark from 'benchmark';
import chalk from 'chalk';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { filterIt, mapIt } from '../transformation';
import type { BenchContext } from './bench-context';
import { BenchData } from './bench-data';
import { BenchFactory } from './bench-factory';
import { generatorMap, mapIterable } from './map.suite';

export function arrayMapThenFilterSuite(
    rate: number,
    outOf: number,
    inputSizes: readonly number[],
): readonly Benchmark.Suite[] {
  return new FilterBenchFactory(rate, outOf)
      .add(
          'for ... of [...].map(...).filter(...)',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of this.data.input.map(el => el + '!').filter(el => this.data.filter(el))) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of *generatorFilter(*generatorMap([...]))',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of generatorFilter(
                generatorMap(this.data.input, el => el + '!'),
                el => this.data.filter(el),
            )) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of filterIterable(mapIterable([...]))',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of filterIterable(
                mapIterable(this.data.input, el => el + '!'),
                el => this.data.filter(el),
            )) {
              this.data.report(element);
            }
          },
      )
      .add(
          'itsEach(filterIt(mapIt([...])))',
          function (this: BenchContext<FilterBenchData>) {
            itsEach(
                filterIt(
                    mapIt(this.data.input, el => el + '!'),
                    el => this.data.filter(el),
                ),
                element => this.data.report(element),
            );
          },
      )
      .suites('Array map then filter', inputSizes);
}

export function iterableMapThenFilterSuite(
    rate: number,
    outOf: number,
    inputSizes: readonly number[],
): readonly Benchmark.Suite[] {
  return new FilterBenchFactory(rate, outOf)
      .add(
          'for ... of *generatorFilter(*generatorMap(iterable))',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of generatorFilter(
                generatorMap(this.data.iterable(), el => el + '!'),
                el => this.data.filter(el),
            )) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of filterIterable(mapIterable(iterable))',
          function (this: BenchContext<FilterBenchData>) {
            for (const element of filterIterable(
                mapIterable(this.data.iterable(), el => el + '!'),
                el => this.data.filter(el),
            )) {
              this.data.report(element);
            }
          },
      )
      .add(
          'itsEach(filterIt(mapIt(overArray([...]))))',
          function (this: BenchContext<FilterBenchData>) {
            itsEach(
                filterIt(
                    mapIt(overArray(this.data.input), (el: string) => el + '!'),
                    el => this.data.filter(el),
                ),
                element => this.data.report(element),
            );
          },
      )
      .add(
          'itsEach(filterIt(mapIt(iterable)))',
          function (this: BenchContext<FilterBenchData>) {
            itsEach(
                filterIt(
                    mapIt(this.data.iterable(), el => el + '!'),
                    el => this.data.filter(el),
                ),
                element => this.data.report(element),
            );
          },
      )
      .suites('Iterable map then filter', inputSizes);
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
