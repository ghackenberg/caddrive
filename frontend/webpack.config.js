const path = require('path')

module.exports = {
    mode: 'development',
    entry: './bin/main.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'frontend.js'
    }
}