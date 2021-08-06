"use strict";
exports.__esModule = true;
var express = require("express");
var proxy = require("http-proxy-middleware");
var app = express();
app.use('/', proxy.createProxyMiddleware({
    router: {
        '/rest': 'http://localhost:3001',
        '/rest-doc': 'http://localhost:3001',
        '/mqtt': 'http://localhost:3004',
        '/worker.js': 'http://localhost:3002',
        '/': 'http://localhost:3003'
    },
    pathRewrite: {
        '/mqtt': '/'
    },
    ws: true
}));
app.listen(3000);
