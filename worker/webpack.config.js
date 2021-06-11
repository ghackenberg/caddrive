const path = require('path')

module.exports = {
    mode: 'development',
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
        path: path.resolve(__dirname, 'public'),
        filename: 'worker.js'
    },
    devtool: 'eval-source-map',
    stats: 'summary',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 3002
    }
}