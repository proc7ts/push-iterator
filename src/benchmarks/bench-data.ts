export class BenchData {

  readonly input: readonly string[];
  private _index = 0;
  readonly output: string[];

  constructor(
      readonly inputSize: number,
      readonly outputSize = inputSize,
  ) {

    const input: string[] = [];

    for (let i = 0; i < inputSize; ++i) {
      input[i] = Math.random().toString(36).substr(2);
    }
    this.input = input;

    this.output = [];
    for (let i = 0; i < outputSize; ++i) {
      this.output[i] = '';
    }
  }

  report(result: string): void {
    this.output[this._index++] = result;
  }

  reset(): this {
    this._index = 0;
    return this;
  }

}
