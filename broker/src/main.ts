import * as net from 'net'
import * as http from 'http'
import * as websocket from 'websocket-stream'
import aedes from 'aedes'

const handler = aedes()

const tcp = net.createServer(handler.handle)
const web = http.createServer()

websocket.createServer({ server: web }, <any> handler.handle)

tcp.listen(1883)
web.listen(3004)