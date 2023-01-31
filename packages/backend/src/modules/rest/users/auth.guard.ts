import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import axios from 'axios'
import { Request } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import * as jwks from 'jwks-rsa'

import { User } from 'productboard-common'
import { Database } from 'productboard-database'

import { AUTH0_JWKS_KID, AUTH0_JWKS_URI } from '../../../env'

const JWKS_CLIENT = jwks({ jwksUri: AUTH0_JWKS_URI })

const JWKS_KEY = JWKS_CLIENT.getSigningKey(AUTH0_JWKS_KID)

@Injectable()
export class AuthGuard implements CanActivate {

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request & { user: User & { permissions: string[] } }>()
        
        const authorization = request.header('authorization')

        if (authorization && authorization.startsWith('Bearer ')) {
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
            try {
                // Find existing user data in database
                request.user = { ...await Database.get().userRepository.findOneByOrFail({ id }), permissions }
            } catch (e) {
                // Get user data from Auth0
                const userinfo = await axios.get(endpoint, { headers: { authorization }})
                // Extract user name and email
                const { name, email } = userinfo.data
                // Insert user data in database
                request.user = { ...await Database.get().userRepository.save({ id, email, name }), permissions }
            }
        }
        
        return true
    }

}