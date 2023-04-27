import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { JWTPayload, jwtVerify } from 'jose'

import { Database } from 'productboard-database'

import { KEY_PAIR } from '../../../key'
import { AuthorizedRequest } from '../../../request'

abstract class TokenGuard implements CanActivate {

    async canActivate(context: ExecutionContext) {
        // Get request
        const request = context.switchToHttp().getRequest<AuthorizedRequest>()
        // Load user
        try {
            // Get header
            const authorization = request.header('authorization')
            // Check header
            if (authorization && authorization.startsWith('Bearer ')) {
                // Load user
                request.user = await loadUser(authorization)
            } else {
                // Init user
                request.user = null
            }
        } catch (e) {
            // Log error
            console.error(e)
            // Init user
            request.user = null
        }
        // Check request
        return this.checkRequest(request)
    }

    protected abstract checkRequest(request: AuthorizedRequest): boolean

}

@Injectable()
export class TokenOptionalGuard extends TokenGuard {

    protected override checkRequest() {
        return true
    }

}

@Injectable()
export class TokenRequiredGuard extends TokenGuard {

    protected override checkRequest(request: AuthorizedRequest) {
        return !!request.user
    }

}

async function loadUser(authorization: string) {
    // Parse token
    const userId = await parseJWT(authorization)
    // Find existing user data in database
    return await Database.get().userRepository.findOneByOrFail({ id: userId })
}

async function parseJWT(authorization: string) {
    // Extract token
    const token = authorization.split(' ')[1]
    // Get key pair
    const keyPair = await KEY_PAIR
    // Get public key
    const publicKey = keyPair.publicKey
    // Verify token
    const verifyResult = await jwtVerify(token, publicKey)
    // Cast payload
    const payload = verifyResult.payload as JWTPayload & { userId: string }
    // Return user ID
    return payload.userId
}