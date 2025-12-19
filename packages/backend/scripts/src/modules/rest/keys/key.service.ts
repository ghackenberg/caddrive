import { Injectable } from "@nestjs/common"
import { JWK } from "jose"
import { KeyREST } from "productboard-common"
import { KEY_PAIR } from "../../../key.js"

@Injectable()
export class KeyService implements KeyREST {
    async getPublicJWK(): Promise<JWK> {
        const keyPair = await KEY_PAIR
        return keyPair.publicJWK
    }
}