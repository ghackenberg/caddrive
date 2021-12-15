import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import * as hash from 'hash.js'
import { User, UserData, UserREST } from 'productboard-common'

@Injectable()
export class UserService implements UserREST {
    private static readonly users: User[] = [
        { id: 'demo-1', name: 'Demo User 1', email: 'test@test.de', password: hash.sha256().update('test').digest('hex') },
        { id: 'demo-2', name: 'Demo User 2', email: 'test@test.at', password: hash.sha256().update('test').digest('hex') },
        { id: 'demo-3', name: 'Demo User 3', email: 'test@test.us', password: hash.sha256().update('test').digest('hex') }
    ]

    async checkUser(): Promise<User> {
        return null
    }

    async findUsers() : Promise<User[]> {
        const results: User[] = []

        for (const user of UserService.users) {
            results.push(user)
        }

        return results
    }

    async addUser(data: UserData) {
        const user = { id: shortid(), ...data }
        UserService.users.push(user)
        return user
    }

    async getUser(id: string): Promise<User> {
        for (const user of UserService.users) {
            if (user.id == id) {
                return user
            }
        }
        throw new NotFoundException()
    }

    async updateUser(id: string, data: UserData): Promise<User> {
        for (var index = 0; index < UserService.users.length; index++) {
            const user = UserService.users[index]
            if (user.id == id) {
                UserService.users.splice(index, 1, { id, ...data })
                return UserService.users[index]
            }
        }
        throw new NotFoundException()
    }

    async deleteUser(id: string): Promise<User> {
        for (var index = 0; index < UserService.users.length; index++) {
            const user = UserService.users[index]
            if (user.id == id) {
                UserService.users.splice(index, 1)
                return user
            }
        }
        throw new NotFoundException()
    }
}