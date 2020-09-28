import type Benchmark from 'benchmark';
import chalk from 'chalk';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { flatMapIt } from '../transformation';
import type { BenchContext } from './bench-context';
import { BenchData } from './bench-data';
import { BenchFactory } from './bench-factory';

export function arrayFlatMapSuite(itemSize: number, inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new FlatMapBenchFactory(itemSize)
      .add(
          'for ... of [...].flatMap(...)',
          function (this: BenchContext<FlatMapBenchData>) {
            for (const element of this.data.input.flatMap(el => this.data.subItems(el))) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of generatorFlatMap([...])',
          function (this: BenchContext<FlatMapBenchData>) {
            for (const element of generatorFlatMap(this.data.input, el => this.data.subItems(el))) {
              this.data.report(element);
            }
          },
      )
      .add(
          'itsEach(flatMapIt([...]))',
          function (this: BenchContext<FlatMapBenchData>) {
            itsEach(
                flatMapIt(this.data.input, el => this.data.subItems(el)),
                element => this.data.report(element),
            );
          },
      )
      .suites('Array flat map', inputSizes);
}

export function iterableFlatMapSuite(itemSize: number, inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new FlatMapBenchFactory(itemSize)
      .add(
          'for ... of generatorFlatMap(iterable)',
          function (this: BenchContext<FlatMapBenchData>) {
            for (const element of generatorFlatMap(this.data.iterable(), el => this.data.subItems(el))) {
              this.data.report(element);
            }
          },
      )
      .add(
          'itsEach(flatMapIt(iterable))',
          function (this: BenchContext<FlatMapBenchData>) {
            itsEach(
                flatMapIt(this.data.iterable(), el => this.data.subItems(el)),
                element => this.data.report(element),
            );
          },
      )
      .add(
          'itsEach(flatMapIt(overArray([...]))',
          function (this: BenchContext<FlatMapBenchData>) {
            itsEach(
                flatMapIt(overArray(this.data.input), el => this.data.subItems(el)),
                element => this.data.report(element),
            );
          },
      )
      .suites('Iterable flat map', inputSizes);
}

class FlatMapBenchData extends BenchData {

  constructor(inputSize: number, readonly itemSize: number) {
    super(inputSize, inputSize * itemSize);
  }

  subItems<T>(element: T): T[] {

    const result: T[] = [];

    for (let i = this.itemSize - 1; i >= 0; --i) {
      result[i] = element;
    }

    return result;
  }

}

class FlatMapBenchFactory extends BenchFactory<FlatMapBenchData> {

  constructor(readonly itemSize: number) {
    super(inputSize => new FlatMapBenchData(inputSize, itemSize));
  }

  benchExtra(): string | undefined {
    return `${chalk.green(this.itemSize)} sub-items`;
  }

}

function *generatorFlatMap<T, R>(source: Iterable<T>, flatMap: (src: T) => Iterable<R>): Iterable<R> {
  for (const src of source) {
    yield* flatMap(src);
  }
}
