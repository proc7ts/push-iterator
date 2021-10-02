export const benchInput: string[] = [];

const benchOutput: string[] = [];

let benchOutputIndex = 0;

benchOutput.length = 256;

export function benchSetup(inputSize: number, ..._other: readonly any[]): void {
  benchOutputIndex = 0;
  benchInput.length = inputSize;
  for (let i = 0; i < inputSize; ++i) {
    benchInput[i] = Math.random().toString(36).substr(2);
  }
}

export function benchOut(result: string): void {
  benchOutput[benchOutputIndex] = result;
  benchOutputIndex = (benchOutputIndex + 1) & 0xFF;
}

export function *benchGenerator(): IterableIterator<string> {
  for (const element of benchInput) {
    yield element;
  }
}

export function benchArray(): string [] {

  const array: string[] = [];

  array.length = benchInput.length;
  benchInput.forEach((element, index) => {
    array[index] = element;
  });

  return array;
}

export function benchIterable(): Iterable<string> {
  return {

    [Symbol.iterator]: () => {

      const it = benchInput[Symbol.iterator]();

      return {
        next() {

          const { done, value } = it.next();

          return done ? { done: true, value: undefined } : { value };
        },
      };
    },

  };
}
