const path = require('path')

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