import { resolve } from "path"

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
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: resolve('public'),
        filename: 'worker.js'
    }
}