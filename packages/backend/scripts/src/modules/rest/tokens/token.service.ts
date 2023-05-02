import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"

import { SignJWT } from 'jose'
import { getTestMessageUrl } from "nodemailer"
import shortid from "shortid"

import { ActivateTokenRequest, ActivateTokenResponse, CreateTokenRequest, CreateTokenResponse, Member, RefreshTokenResponse, TokenREST, User } from "productboard-common"
import { Database, getTokenOrFail, getUserOrFail } from "productboard-database"

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
        const id = shortid()
        const created = Date.now()
        const email = request.email
        const code = shortid().substring(0, 6)
        const count = 0
        const token = await Database.get().tokenRepository.save({ id, created, email, code, count })
        const transporter = await TRANSPORTER
        const info = await transporter.sendMail({
            from: 'ProductBoard <ghackenberg@gmail.com>',
            to: email,
            subject: 'Verification code',
            templateName: 'code',
            templateData: {
                code
            }
        })
        console.log(code)
        console.log(getTestMessageUrl(info))
        return { id: token.id }
    }
    
    async activateToken(id: string, request: ActivateTokenRequest): Promise<ActivateTokenResponse> {
        // Find token
        const token = await getTokenOrFail({ id }, NotFoundException)
        // Update count
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
            const id = shortid()
            const created = Date.now()
            const email = token.email
            const user = await Database.get().userRepository.save({ id, created, email })
            await registerNewUserAsMemberForDemo(id)
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
    const jwt = await new SignJWT({ userId: user.id }).setProtectedHeader({ alg: 'PS256' }).setExpirationTime('7d').sign(privateKey)
    // Return JWT
    return { jwt }
}

function registerNewUserAsMemberForDemo(id: string) {
    const members: Member[] = [
        { id: 'demo-7', userId: id, productId: "demo-1", created: Date.now(), updated: Date.now(), deleted: null, role: 'manager'},
        { id: 'demo-8', userId: id, productId: "demo-2", created: Date.now(), updated: Date.now(), deleted: null, role: 'manager'},
        { id: 'demo-9', userId: id, productId: "demo-3", created: Date.now(), updated: Date.now(), deleted: null, role: 'manager'},
    ]
    for (const member of members) {
        Database.get().memberRepository.save(member)
    }
}