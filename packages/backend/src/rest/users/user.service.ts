import 'multer'
import * as fs from 'fs'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import * as hash from 'hash.js'
import { User, UserData, UserREST } from 'productboard-common'

@Injectable()
export class UserService implements UserREST<UserData, Express.Multer.File> {
    private static readonly users: User[] = [
        { id: 'demo-1', name: 'Georg Hackenberg', email: 'georg.hackenberg@fh-wels.at', password: hash.sha256().update('test').digest('hex'), deleted: false},
        { id: 'demo-2', name: 'Christian Zehetner', email: 'christian.zehetner@fh-wels.at', password: hash.sha256().update('test').digest('hex'), deleted: false },
        { id: 'demo-3', name: 'Jürgen Humenberger', email: 'juergen.humenberger@fh-wels.at', password: hash.sha256().update('test').digest('hex'), deleted: false },
        { id: 'demo-4', name: 'Dominik Frühwirth', email: 'dominik.fruehwirth@fh-wels.at', password: hash.sha256().update('test').digest('hex'), deleted: false }
    ]

    async checkUser(): Promise<User> {
        return null
    }

    async findUsers() : Promise<User[]> {
        const results: User[] = []

        for (const user of UserService.users) {
            if (!user.deleted) {
                results.push(user)
            }
        }

        return results
    }

    async addUser(data: UserData, file?: Express.Multer.File) {
        const user = { id: shortid(), ...data }
        if (file && file.originalname.endsWith('.jpg')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${user.id}.jpg`, file.buffer)
        }
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

    async updateUser(id: string, data: UserData, file?: Express.Multer.File): Promise<User> {
        for (var index = 0; index < UserService.users.length; index++) {
            const user = UserService.users[index]
            if (user.id == id) {
                UserService.users.splice(index, 1, { id, ...data })
                if (file && file.originalname.endsWith('.jpg')) {
                    if (!fs.existsSync('./uploads')) {
                        fs.mkdirSync('./uploads')
                    }
                    fs.writeFileSync(`./uploads/${id}.jpg`, file.buffer)
                }
                return UserService.users[index]
            }
        }
        throw new NotFoundException()
    }

    async deleteUser(id: string): Promise<User> {
        for (var index = 0; index < UserService.users.length; index++) {
            const user = UserService.users[index]
            if (user.id == id) {
                user.deleted = true
                return user
            }
        }
        throw new NotFoundException()
    }
}