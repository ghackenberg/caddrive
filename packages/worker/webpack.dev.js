import { resolve } from "path"

import { merge } from 'webpack-merge'

import common from './webpack.common.js'

export default merge(common, {
    mode: 'development',
    devServer: {
        static: resolve('public'),
        port: 3002
    },
    devtool: 'inline-source-map'
})