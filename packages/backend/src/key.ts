import { existsSync, writeFileSync, readFileSync } from 'fs'

import { generateKeyPair, exportJWK, importJWK } from 'jose'

async function init() {
    if (!existsSync('public_key.jwk')) {
        const keyPair = await generateKeyPair("PS256")
        
        const publicKey = keyPair.publicKey
        const privateKey = keyPair.privateKey

        const publicJWK = await exportJWK(publicKey)
        const privateJWK = await exportJWK(privateKey)

        writeFileSync('public_key.jwk', JSON.stringify(publicJWK))
        writeFileSync('private_key.jwk', JSON.stringify(privateJWK))

        return { publicKey, publicJWK, privateKey, privateJWK }
    } else {
        const publicJWK = JSON.parse(readFileSync('public_key.jwk', 'utf-8'))
        const privateJWK = JSON.parse(readFileSync('private_key.jwk', 'utf-8'))

        const publicKey = await importJWK(publicJWK, "PS256")
        const privateKey = await importJWK(privateJWK, "PS256")

        return { publicKey, publicJWK, privateKey, privateJWK }
    }
}

export const KEY_PAIR = init()