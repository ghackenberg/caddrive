import express from 'express'
import proxy from 'http-proxy-middleware'

const app = express()

app.use('/rest', proxy({ target: 'http://localhost:3001' }))
app.use('/rest-doc', proxy({ target: 'http://localhost:3001' }))
app.use('/mqtt', proxy({ target: 'http://localhost:3004/', pathRewrite: { '/mqtt': '/' }, ws: true }))
app.use('/worker.js', proxy({ target: 'http://localhost:3002' }))
app.use('/', proxy({ target: 'http://localhost:3003' }))

app.listen(3000)