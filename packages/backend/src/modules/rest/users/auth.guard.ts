import { readFileSync } from 'fs'

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import axios from 'axios'
import { Request } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import * as shortid from 'shortid'

import { User } from 'productboard-common'
import { UserRepository } from 'productboard-database'

const CERTIFICATE = readFileSync('certificate.pem')

@Injectable()
export class AuthGuard implements CanActivate {

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request & { user: User }>()
        
        const authorization = request.header('authorization')

        if (authorization && authorization.startsWith('Bearer ')) {
            // Extract token
            const token = authorization.split(' ')[1]
            // Verify token
            const payload = verify(token, CERTIFICATE) as JwtPayload
            // Extract user info endpoint
            const endpoint = payload.aud[1]
            // Extract user id
            const id = payload.sub.split('|')[1]
            try {
                // Find existing user data in database
                request.user = await UserRepository.findOneByOrFail({ id })
            } catch (e) {
                // Get user data from Auth0
                const userinfo = await axios.get(endpoint, { headers: { authorization }})
                // Extract user name and email
                const { name, email } = userinfo.data
                // Insert user data in database
                request.user = await UserRepository.save({ id, email, name, userManagementPermission: false, productManagementPermission: false, password: '', pictureId: shortid() })
            }
            return true
        } else {
            return false
        }
    }

}