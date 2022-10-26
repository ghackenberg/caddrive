import { BasicStrategy } from 'passport-http'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { User } from 'productboard-common'
import { UserService } from './user.service'

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
        for (const user of await this.userService.findUsers()) {
            if (user.email == email && user.password == password) {
                return user
            }
        }
        throw new UnauthorizedException()
    }
}