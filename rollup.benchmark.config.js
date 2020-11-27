import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { externalModules } from '@run-z/rollup-helpers';
import sourcemaps from 'rollup-plugin-sourcemaps';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';

export default {
  input: './src/benchmarks/main.ts',
  plugins: [
    commonjs(),
    ts({
      typescript,
      tsconfig: 'tsconfig.benchmark.json',
      cacheRoot: 'target/.rts2_cache',
      useTsconfigDeclarationDir: true,
    }),
    nodeResolve(),
    sourcemaps(),
  ],
  external: externalModules(),
  output: {
    format: 'esm',
    sourcemap: true,
    file: './target/benchmark.js',
  },
};
