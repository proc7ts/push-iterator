import type Benchmark from 'benchmark';
import chalk from 'chalk';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { flatMapArray, flatMapIt } from '../transformation';
import { benchArray, benchInput, benchIterable, benchOut, benchSetup } from './bench-data';
import { BenchFactory } from './bench-factory';

export function arrayFlatMapSuite(itemSize: number, inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new FlatMapBenchFactory()
      .add(
          'for ... of [...].flatMap(...)',
          () => {
            for (const element of benchInput.flatMap(el => benchSubItems(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of *generatorFlatMap([...])',
          () => {
            for (const element of generatorFlatMap(benchInput, el => benchSubItems(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'itsEach(flatMapIt([...]))',
          () => {
            itsEach(
                flatMapIt(benchInput, el => benchSubItems(el)),
                element => benchOut(element),
            );
          },
      )
      .add(
          'itsEach(flatMapArray([...]))',
          () => {
            itsEach(
                flatMapArray(benchInput, el => benchSubItems(el)),
                element => benchOut(element),
            );
          },
      )
      .suites('Array flat map', inputSizes.map(inputSize => [inputSize, itemSize]));
}

export function iterableFlatMapSuite(itemSize: number, inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new FlatMapBenchFactory()
      .add(
          'for ... of buildArray().flatMap(...)',
          () => {
            for (const element of benchArray().flatMap(el => benchSubItems(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of *generatorFlatMap(iterable)',
          () => {
            for (const element of generatorFlatMap(benchIterable(), el => benchSubItems(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'itsEach(flatMapIt(iterable))',
          () => {
            itsEach(
                flatMapIt(benchIterable(), el => benchSubItems(el)),
                element => benchOut(element),
            );
          },
      )
      .add(
          'itsEach(flatMapIt(overArray([...]))',
          () => {
            itsEach(
                flatMapIt(overArray(benchInput), el => benchSubItems(el)),
                element => benchOut(element),
            );
          },
      )
      .suites('Iterable flat map', inputSizes.map(inputSize => [inputSize, itemSize]));
}

class FlatMapBenchFactory extends BenchFactory<[inputSize: number, itemSize: number]> {

  constructor() {
    super(benchSetupFilterMap);
  }

  benchExtra(_itemSize: number, itemSize: number): string | undefined {
    return `${chalk.green(itemSize)} sub-items`;
  }

}

let benchItemSize = 1;

function benchSetupFilterMap(inputSize: number, itemSize: number): void {
  benchSetup(inputSize);
  benchItemSize = itemSize;
}

function benchSubItems<T>(element: T): T[] {

  const result: T[] = [];

  for (let i = benchItemSize - 1; i >= 0; --i) {
    result[i] = element;
  }

  return result;
}

function *generatorFlatMap<T, R>(source: Iterable<T>, flatMap: (src: T) => Iterable<R>): Iterable<R> {
  for (const src of source) {
    yield* flatMap(src);
  }
}
