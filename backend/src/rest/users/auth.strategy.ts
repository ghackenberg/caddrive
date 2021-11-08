import { BasicStrategy } from 'passport-http'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UserService } from './user.service'
import { User } from 'fhooe-audit-platform-common'

@Injectable()
export class AuthStrategy extends PassportStrategy(BasicStrategy) {
    constructor(
        private readonly userService: UserService
    ) {
        super({
            passReqToCallback: false
        })
    }

    public async validate(email: string, password: string): Promise<User> {
        const users = await this.userService.findUsers(undefined, undefined, email)
        for (const user of users) {
            if (user.email == email && user.password == password) {
                return user
            }
        }
        throw new UnauthorizedException()
    }
}