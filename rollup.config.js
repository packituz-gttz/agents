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
        isProduction && terser({
            format: {
                comments: false
            },
            compress: {
                dead_code: true,
                drop_debugger: true,
                conditionals: true,
                evaluate: true,
                booleans: true,
                loops: true,
                unused: true,
                hoist_funs: true,
                keep_fargs: false,
                hoist_vars: true,
                if_return: true,
                join_vars: true,
                side_effects: true,
                warnings: false
            },
            mangle: {
                properties: {
                    regex: /^_/
                }
            }
        }),
        isProduction && obfuscator({
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: true,
            debugProtectionInterval: 0, // Changed from true to 0
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: true,
            shuffleStringArray: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
        })
    ].filter(Boolean),
    external: [
        /node_modules/
    ]
};
