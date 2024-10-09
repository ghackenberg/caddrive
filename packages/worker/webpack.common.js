import { resolve } from 'path'

import 'webpack'

export default {
    stats: 'minimal',
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },{
                test: /\.(wasm)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'modules/worker/[hash][ext][query]'
                }
            }
        ],
    },
    resolve: {
        alias: {
            'three': resolve('../../node_modules/three')
        },
        extensions: ['.ts', '.js'],
    },
    output: {
        path: resolve('public'),
        filename: 'scripts/worker/[name].js'
    }
}