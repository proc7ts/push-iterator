import Benchmark from 'benchmark';
import chalk from 'chalk';
import type { BenchContext } from './bench-context';
import { BenchData } from './bench-data';

export class BenchFactory {

  private readonly _benches: ((suite: Benchmark.Suite, inputSize: number) => void)[] = [];

  add(
      name: string,
      fn: (this: BenchContext) => void,
      createData: (inputSize: number) => BenchData = inputSize => new BenchData(inputSize),
  ): this {
    this._benches.push((suite, inputSize) => {

      const newData = (): BenchData => createData(inputSize);

      suite.add(
          name,
          fn,
          {
            newData,

            setup(this: BenchContext) {
              this.data = this.newData();
              this.generator = function *(input: Iterable<string>): IterableIterator<string> {
                for (const element of input) {
                  yield element;
                }
              };
              this.iterable = function (input: Iterable<string>): Iterable<string> {
                return {

                  [Symbol.iterator]: () => {

                    const it = input[Symbol.iterator]();

                    return {
                      next() {
                        return it.next();
                      },
                    };
                  },

                };
              };
            },

            onCycle() {
              this.data = this.newData();
            },

          } as any,
      );
    });

    return this;
  }

  suites(name: string, inputSizes: readonly number[]): readonly Benchmark.Suite[] {

    const suites: Benchmark.Suite[] = [];

    for (const inputSize of inputSizes) {

      const suite = new Benchmark.Suite(
          `${chalk.cyan(name)} ${chalk.grey('(' + chalk.green(String(inputSize)) + ' times)')}`,
      );

      for (const bench of this._benches) {
        bench(suite, inputSize);
      }

      suites.push(suite);
    }

    return suites;
  }

}
