import { externalModules } from '@proc7ts/rollup-helpers';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';
import sourcemaps from 'rollup-plugin-sourcemaps';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';

export default {
  input: {
    'push-iterator': './src/index.ts',
    'push-iterator.call-thru': './src/call-thru/index.ts',
  },
  plugins: [
    commonjs(),
    ts({
      typescript,
      tsconfig: 'tsconfig.main.json',
      cacheRoot: 'target/.rts2_cache',
      useTsconfigDeclarationDir: true,
    }),
    nodeResolve(),
    sourcemaps(),
  ],
  external: externalModules(),
  manualChunks(id) {
    if (id.startsWith(path.join(__dirname, 'src', 'call-thru') + path.sep)) {
      return 'push-iterator.call-thru';
    }
    return 'push-iterator';
  },
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      dir: './dist',
      entryFileNames: '[name].js',
      chunkFileNames: `_[name].js`,
      hoistTransitiveImports: false,
    },
    {
      format: 'esm',
      sourcemap: true,
      dir: './dist',
      entryFileNames: '[name].mjs',
      chunkFileNames: `_[name].mjs`,
      hoistTransitiveImports: false,
    },
  ],
};
