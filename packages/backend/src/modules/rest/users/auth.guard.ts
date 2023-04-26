import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import axios from 'axios'
import { Request } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'

import { User } from 'productboard-common'
import { Database } from 'productboard-database'

import { AUTH0_JWKS_KID, AUTH0_JWKS_URI } from '../../../env'

// Create JWKS client
const JWKS_CLIENT = new JwksClient({ jwksUri: AUTH0_JWKS_URI })
// Load JWKS signing key
const JWKS_KEY = JWKS_CLIENT.getSigningKey(AUTH0_JWKS_KID)

@Injectable()
export class AuthGuard implements CanActivate {

    async canActivate(context: ExecutionContext) {
        try {
            // Get request
            const request = context.switchToHttp().getRequest<Request & { user: User & { permissions: string[] } }>()
            // Get header
            const authorization = request.header('authorization')
            // Check header
            if (authorization && authorization.startsWith('Bearer ')) {
                // Load user
                request.user = await this.loadUser(authorization)
                // Accept
                return true
            } else {
                // Reject
                return false
            }
        } catch (e) {
            // Reject
            return false
        }
    }

    private async loadUser(authorization: string) {
        // Parse token
        const { id, endpoint, permissions } = await this.parseToken(authorization)
        // Find or insert user
        try {
            // Find existing user data in database
            const user = await Database.get().userRepository.findOneByOrFail({ id })
            // Return
            return { ...user, permissions }
        } catch (e) {
            // Get user data from Auth0
            const userinfo = await axios.get(endpoint, { headers: { authorization }})
            // Extract user name and email
            const { name, email } = userinfo.data
            // Get timestamp
            const created = Date.now()
            // Insert user data in database
            const user = await Database.get().userRepository.save({ id, created, email, name })
            // Return
            return { ...user, permissions }
        }
    }

    private async parseToken(authorization: string) {
        // Extract token
        const token = authorization.split(' ')[1]
        // Obtain key
        const jwks_key = await JWKS_KEY
        // Public key
        const public_key = jwks_key.getPublicKey()
        // Verify token
        const { aud, sub, permissions } = verify(token, public_key) as JwtPayload & { permissions: string[] }
        // Extract user info endpoint
        const endpoint = aud[1]
        // Extract user id
        const id = sub.split('|')[1]
        // Returnd data
        return { id, endpoint, permissions }
    }

}