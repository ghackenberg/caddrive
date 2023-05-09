import { JWK } from "jose"

import { KeyREST } from "productboard-common"

import { KeyClient } from "../clients/rest/key"

class KeyManagerImpl implements KeyREST {
    private key: JWK
    
    async getPublicJWK() {
        if (!this.key) {
            this.key = await KeyClient.getPublicJWK()
        }
        return this.key
    }
}

export const KeyManager = new KeyManagerImpl()