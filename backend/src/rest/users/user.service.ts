import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { User, UserREST } from 'fhooe-audit-platform-common'

@Injectable()
export class UserService implements UserREST {
    private readonly users: User[] = []

    constructor() {
        for (var i = 0; i < Math.random() * 20; i++) {
            this.users.push({
                id: shortid(),
                email: shortid()
            })
        }
    }

    async findAll() {
        return this.users
    }

    async addUser(user: User) {
        this.users.push(user)
        
        return user
    }

    async updateUser(user: User) {
        
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id == user.id)
                this.users.splice(i,1,user)
        }

        return user
    }
}