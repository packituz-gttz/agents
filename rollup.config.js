import path from 'path';
import { fileURLToPath } from 'url';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { cleandir } from 'rollup-plugin-cleandir';
import resolve from '@rollup/plugin-node-resolve';
import obfuscator from 'rollup-plugin-obfuscator';
import typescript from '@rollup/plugin-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: !isProduction
  },
  plugins: [
    cleandir('dist'),
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') }
      ]
    }),
    resolve({
      preferBuiltins: true,
      extensions: ['.js', '.ts']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: !isProduction,
      inlineSources: !isProduction
    }),
    isProduction && terser(),
    isProduction && obfuscator({
      global: true,
      options: {
        stringArray: true,
        stringArrayEncoding: ['base64'],
        splitStrings: true,
        identifierNamesGenerator: 'hexadecimal',
        sourceMap: false,
      }
    })
  ].filter(Boolean),
  external: [
    /node_modules/
  ]
};
