import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { User, UserREST } from 'fhooe-audit-platform-common'

@Injectable()
export class UserService implements UserREST {
    private readonly users: User[] = []

    constructor() {
        for (var i = 0; i < Math.random() * 20; i++) {
            this.users.push({
                id: shortid()
            })
        }
    }

    async findAll() {
        return this.users
    }
}