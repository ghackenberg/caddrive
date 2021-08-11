import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { User, UserData, UserREST } from 'fhooe-audit-platform-common'

@Injectable()
export class UserService implements UserREST {
    private readonly users: User[] = []

    constructor() {
        for (var i = 0; i < Math.random() * 20; i++) {
            this.users.push({
                id: shortid(),
                name : shortid(),
                email: shortid()
            })
        }
    }

    async findAll() {
        return this.users
    }

    async getUser(id: string): Promise<User> {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id == id)
                return this.users[i]
        }
        return null
    }

    async addUser(data: UserData) {
        const user = { id: shortid(), ...data }

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