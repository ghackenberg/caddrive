const path = require('path')

module.exports = (env, argv) => (
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
            path: path.resolve(__dirname, 'public'),
            filename: 'worker.js'
        },
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            port: 3002
        },
        devtool: 'inline-source-map'
    }
)