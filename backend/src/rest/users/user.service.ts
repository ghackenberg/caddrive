import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { User, UserData, UserREST } from 'fhooe-audit-platform-common'

@Injectable()
export class UserService implements UserREST {

    private static users: User[] = [{ id: 'default', name: 'test', email: '1234.1234@1234.com', password: 'RRQ+kDaceIlmBEUtCk667DZj9EwXXFgUkt+jVsF6ghk=' }]

    async addUser(data: UserData) {
        const user = { id: shortid(), ...data }

        //var crypto = require('crypto-js');
        //const salt = data.email

        //var algo = crypto.algo.SHA256.create()
        //algo.encrypt(crypto.enc.Base64)

        UserService.users.push(user)
        
        return user
    }

    async checkUser(): Promise<User> {
        return null
    }

    async deleteUser(user: User): Promise<User[]> {
        
        UserService.users = UserService.users.filter(users => users.id != user.id)
        return UserService.users
    }

    async findUsers(quick?: string, name?: string, email?: string) : Promise<User[]> {
        
        const results: User[] = []

        quick = quick ? quick.toLowerCase() : undefined
        name = name ? name.toLowerCase() : undefined
        email = email ? email.toLowerCase() : undefined

        for (var index = 0; index < UserService.users.length; index++) {

            const user = UserService.users[index]

            if (quick) {
                const conditionA = user.name.toLowerCase().includes(quick)
                const conditionB = user.email.toLowerCase().includes(quick)

                if (!(conditionA || conditionB)) {
                    continue
                }
            }
            if (name && !user.name.toLowerCase().includes(name)) {
                continue
            }
            if (email && !user.email.toLowerCase().includes(email)) {
                continue
            }
            results.push(user)
        }

        return results
    }

    async getUser(id: string): Promise<User> {
        for (var j = 0; j < UserService.users.length; j++) {
            if (UserService.users[j].id == id)
                return UserService.users[j]
        }
        return null
    }

    async updateUser(user: User): Promise<User> {
        
        for (var i = 0; i < UserService.users.length; i++) {
            if (UserService.users[i].id == user.id && (
                UserService.users[i].name != user.name ||
                UserService.users[i].email != user.email)) {

                    UserService.users.splice(i,1,user)
            }
        }
        return user
    }
}