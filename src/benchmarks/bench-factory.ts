import Benchmark from 'benchmark';
import chalk from 'chalk';
import { benchSetup } from './bench-data';

export type BenchVariant = [inputSize: number];

export class BenchFactory<TVariant extends [inputSize: number, ...other: any[]] = BenchVariant> {

  private readonly _benches: ((suite: Benchmark.Suite, variant: TVariant) => void)[] = [];

  constructor(protected readonly _setup: (...args: TVariant) => void = benchSetup) {
  }

  add(name: string, fn: () => void): this {
    this._benches.push((suite, variant) => {

      const setup = function (this: BenchContext): void {
        this.benchSetup();
      };

      suite.add(
          name,
          fn,
          {
            benchSetup: () => this._setup(...variant),
            setup,
            onCycle: setup,
          } as Benchmark.Options & BenchContext,
      );
    });

    return this;
  }

  benchExtra(..._variant: TVariant): string | undefined {
    return;
  }

  suites(name: string, variants: readonly TVariant[]): readonly Benchmark.Suite[] {

    const suites: Benchmark.Suite[] = [];

    for (const variant of variants) {

      const [inputSize] = variant;
      let info = chalk.green(String(inputSize)) + ' items';
      const extra = this.benchExtra(...variant);

      if (extra) {
        info += ', ' + extra;
      }

      const suite = new Benchmark.Suite(
          `${chalk.cyan(name)} ${chalk.grey('(' + info + ')')}`,
      );

      for (const bench of this._benches) {
        bench(suite, variant);
      }

      suites.push(suite);
    }

    return suites;
  }

}

interface BenchContext {
  benchSetup(): void;
}
