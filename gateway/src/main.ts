import * as express from 'express'
import * as proxy from 'express-http-proxy'

const app = express()

app.use('/api', proxy('localhost:3001', {
    proxyReqPathResolver: request => request.url.startsWith('/doc') ? request.url : `/api${request.url}`
}))
app.use('/worker.js', proxy('localhost:3002'))
app.use('/', proxy('localhost:3003'))

app.listen(3000)