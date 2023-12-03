import { resolve } from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
const { ProvidePlugin } = webpack

export default {
    stats: 'minimal',
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        alias: {
            'three': resolve('../../node_modules/three')
        },
        fallback: {
            'os': false,
            'stream': false,
            'http': false,
            'https': false,
            'zlib': false,
            'util': false,
            'path': false,
            'crypto': false,
            '@nestjs/core': false,
            '@nestjs/common': false,
            '@nestjs/mapped-types': false,
            '@nestjs/swagger': false,
            '@nestjs/microservices': false
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser.js'
        })
    ],
    output: {
        path: resolve('public'),
        filename: 'scripts/worker/[name].js'
    }
}