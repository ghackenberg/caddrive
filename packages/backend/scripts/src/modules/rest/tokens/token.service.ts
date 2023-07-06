import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"

import { SignJWT } from 'jose'
import { getTestMessageUrl } from "nodemailer"
import shortid from "shortid"

import { ActivateTokenRequest, ActivateTokenResponse, CreateTokenRequest, CreateTokenResponse, RefreshTokenResponse, TokenREST, User } from "productboard-common"
import { Database, getTokenOrFail, getUserOrFail } from "productboard-database"

import { emitUserMessage } from "../../../functions/emit"
import { TRANSPORTER } from "../../../functions/mail"
import { KEY_PAIR } from "../../../key"
import { AuthorizedRequest } from "../../../request"

@Injectable()
export class TokenService implements TokenREST {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    async createToken(request: CreateTokenRequest): Promise<CreateTokenResponse> {
        const tokenId = shortid()
        const created = Date.now()
        const updated = created
        const email = request.email
        const code = shortid().substring(0, 6)
        const count = 0
        await Database.get().tokenRepository.save({ tokenId, created, updated, email, code, count })
        const transporter = await TRANSPORTER
        const info = await transporter.sendMail({
            from: 'CADdrive <mail@caddrive.com>',
            to: email,
            subject: 'Verification code',
            templateName: 'code',
            templateData: {
                code
            }
        })
        console.log(code)
        console.log(getTestMessageUrl(info))
        return { tokenId }
    }
    
    async activateToken(tokenId: string, request: ActivateTokenRequest): Promise<ActivateTokenResponse> {
        // Find token
        const token = await getTokenOrFail({ tokenId }, NotFoundException)
        // Update count
        token.updated = Date.now()
        token.count++
        await Database.get().tokenRepository.save(token)
        // Check count
        if (token.count > 3) {
            throw new NotFoundException()
        }
        // Check code
        const code = request.code
        if (token.code != code) {
            throw new BadRequestException()
        }
        // Create JWT
        try {
            // ... for existing user
            const email = token.email
            const user = await getUserOrFail({ email }, Error)
            // Return JWT
            return createJWT(user)
        } catch (e) {
            // ... for new user
            const userId = shortid()
            const created = token.updated
            const updated = token.updated
            const email = token.email
            const user = await Database.get().userRepository.save({ userId, created, updated, email })
            // Emit changes
            emitUserMessage(userId, { users: [user] })
            // Return JWT
            return createJWT(user)
        }
    }

    async refreshToken(): Promise<RefreshTokenResponse> {
        // Get user
        const user = this.request.user
        // Return JWT
        return createJWT(user)
    }
}

async function createJWT(user: User) {
    // Get key pair
    const keyPair = await KEY_PAIR
    // Get private key
    const privateKey = keyPair.privateKey
    // Create JWT
    const jwt = await new SignJWT({ userId: user.userId }).setProtectedHeader({ alg: 'PS256' }).setExpirationTime('7d').sign(privateKey)
    // Return JWT
    return { jwt }
}