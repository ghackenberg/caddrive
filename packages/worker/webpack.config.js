import { resolve } from "path"

import 'webpack'

export default (_env, argv) => (
    {
        mode: argv.mode,
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
        },
        devServer: {
            static: resolve('public'),
            port: 3002
        },
        devtool: 'inline-source-map'
    }
)