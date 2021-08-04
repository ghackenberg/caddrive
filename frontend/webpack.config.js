const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    stats: 'minimal',
    entry: './src/main.tsx',
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
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser'
        }),
        new HtmlWebpackPlugin({
            publicPath: '/',
            title: 'FHOOE Virtual Engineering Platform',
            filename: '404.html'
        })
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'frontend.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 3003,
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '404.html' }
            ]
        }
    }
}