const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: 'development',
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
        })
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'frontend.js'
    },
    devtool: 'eval-source-map',
    stats: 'summary',
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