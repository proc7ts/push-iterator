import Benchmark from 'benchmark';
import chalk from 'chalk';
import type { BenchContext } from './bench-context';
import { BenchData } from './bench-data';

export class BenchFactory<TData extends BenchData = BenchData> {

  private readonly _benches: ((suite: Benchmark.Suite, inputSize: number) => void)[] = [];

  constructor(readonly createData: (inputSize: number) => TData = inputSize => new BenchData(inputSize) as TData) {
  }

  add(name: string, fn: (this: BenchContext<TData>) => void): this {
    this._benches.push((suite, inputSize) => {

      const newData = (): TData => this.createData(inputSize);

      suite.add(
          name,
          fn,
          {
            newData,

            setup(this: BenchContext) {
              this.data = this.newData();
            },

            onCycle() {
              this.data = this.newData();
            },

          } as any,
      );
    });

    return this;
  }

  benchExtra(): string | undefined {
    return;
  }

  suites(name: string, inputSizes: readonly number[]): readonly Benchmark.Suite[] {

    const suites: Benchmark.Suite[] = [];

    for (const inputSize of inputSizes) {

      let info = chalk.green(String(inputSize)) + ' items';
      const extra = this.benchExtra();

      if (extra) {
        info += ', ' + extra;
      }

      const suite = new Benchmark.Suite(
          `${chalk.cyan(name)} ${chalk.grey('(' + info + ')')}`,
      );

      for (const bench of this._benches) {
        bench(suite, inputSize);
      }

      suites.push(suite);
    }

    return suites;
  }

}
