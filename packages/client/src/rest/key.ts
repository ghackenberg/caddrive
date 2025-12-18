import axios from "axios"
import { JWK } from "jose"

import { KeyREST } from "productboard-common"

class KeyClientImpl implements KeyREST {
    async getPublicJWK(): Promise<JWK> {
        return (await axios.get<JWK>('/rest/keys')).data
    }
}

export const KeyClient = new KeyClientImpl()