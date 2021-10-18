import { BasicStrategy } from 'passport-http'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UserService } from './user.service'
import { User } from 'fhooe-audit-platform-common'

@Injectable()
export class AuthStrategy extends PassportStrategy(BasicStrategy) {

    constructor(private readonly userService: UserService) {
        super({
            passReqToCallback: false
        })
    }

    public async validate(username: string, password: string): Promise<User> {
        const users = await this.userService.findUsers(undefined, undefined, username)
        for (var i = 0; i < users.length; i++) {
            if (users[i].email == username && users[i].password == password) {
                return users[i]
            }
        }
        throw new UnauthorizedException()
    }
}