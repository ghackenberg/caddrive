import { resolve } from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
const { NormalModuleReplacementPlugin, ProvidePlugin } = webpack

export default {
    stats: 'minimal',
    entry: './src/scripts/main.tsx',
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
                    filename: 'modules/frontend/[hash][ext][query]'
                }
            },{
                test: /\.(css)$/i,
                use: ['style-loader', 'css-loader']
            },{
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/frontend/[hash][ext][query]'
                }
            },{
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/frontend/[hash][ext][query]'
                }
            }
        ],
    },
    resolve: {
        alias: {
            'three': resolve('../../node_modules/three')
        },
        fallback: {
            'crypto': false,
            'http': false,
            'https': false,
            'fs': false,
            'os': false,
            'path': false,
            'stream': false,
            'util': false,
            'zlib': false,
            '@nestjs/common': false,
            '@nestjs/core': false,
            '@nestjs/mapped-types': false,
            '@nestjs/microservices': false,
            '@nestjs/swagger': false
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new NormalModuleReplacementPlugin(/node:/, resource => {
            return resource.request = resource.request.replace(/node:/, "")
        }),
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser.js'
        }),
        new HtmlWebpackPlugin({
            publicPath: '/',
            title: 'CADdrive - Your collaborative workspace for LDraw&trade; models',
            filename: '404.html'
        })
    ],
    output: {
        path: resolve('public'),
        filename: 'scripts/frontend/[name].js'
    }
}