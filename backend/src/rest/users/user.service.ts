import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { User, UserData, UserREST } from 'productboard-common'

@Injectable()
export class UserService implements UserREST {
    private static readonly users: User[] = [
        { id: 'demo', name: 'Demo User', email: 'test@test.com', password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' }
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