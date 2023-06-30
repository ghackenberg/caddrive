import { SignJWT } from 'jose'
import { connect } from 'mqtt'
import shortid from 'shortid'

import { KEY_PAIR } from './key'

const protocol = 'mqtt'
const hostname = 'localhost'
const port = 3003

export const MqttAPI = KEY_PAIR.then(async keys => {
    const privateKey = keys.privateKey
    const username = await new SignJWT({}).setProtectedHeader({ alg: 'PS256' }).setExpirationTime('1d').sign(privateKey)
    return connect({ protocol, hostname, port, clientId: `productboard-backend-${shortid()}`, username })
})