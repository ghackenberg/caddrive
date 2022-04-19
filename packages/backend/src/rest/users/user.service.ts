import 'multer'
import * as fs from 'fs'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import * as hash from 'hash.js'
import { User, UserAddData, UserUpdateData, UserREST } from 'productboard-common'
import { MemberService } from '../members/member.service'

@Injectable()
export class UserService implements UserREST<UserAddData, Express.Multer.File> {
    private static readonly users: User[] = [
        { id: 'demo-1', name: 'Georg Hackenberg', email: 'georg.hackenberg@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-1', deleted: false},
        { id: 'demo-2', name: 'Christian Zehetner', email: 'christian.zehetner@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-2', deleted: false },
        { id: 'demo-3', name: 'Jürgen Humenberger', email: 'juergen.humenberger@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-3', deleted: true },
        { id: 'demo-4', name: 'Dominik Frühwirth', email: 'dominik.fruehwirth@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-4', deleted: false }
    ]

    constructor(
        private readonly memberService: MemberService
    ) {}

    async checkUser(): Promise<User> {
        return null
    }

    async findUsers(query?: string, productId?: string) : Promise<User[]> {
        const results: User[] = []
        for (const user of UserService.users) {
            if (user.deleted) {
                continue
            }
            if (query && !user.name.toLowerCase().includes(query.toLowerCase())) {
                continue
            }
            if (productId && (await this.memberService.findMembers(productId, user.id)).length > 0) {
                continue
            }
            results.push(user)
        }
        return results
    }

    async addUser(data: UserAddData, file?: Express.Multer.File) {
        const user = { id: shortid(), deleted: false, pictureId: shortid(), ...data }
        if (file && file.originalname.endsWith('.jpg')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${user.pictureId}.jpg`, file.buffer)
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

    async updateUser(id: string, data: UserUpdateData, file?: Express.Multer.File): Promise<User> {
        for (var index = 0; index < UserService.users.length; index++) {
            const user = UserService.users[index]
            if (user.id == id) {
                UserService.users.splice(index, 1, { ...user,...data })
                if (file && file.originalname.endsWith('.jpg')) {
                    UserService.users[index].pictureId = shortid()
                    if (!fs.existsSync('./uploads')) {
                        fs.mkdirSync('./uploads')
                    }
                    fs.writeFileSync(`./uploads/${UserService.users[index].pictureId}.jpg`, file.buffer)
                }
                return UserService.users[index]
            }
        }
        throw new NotFoundException()
    }

    async deleteUser(id: string): Promise<User> {
        for (const user of UserService.users) {
            if (user.id == id) {
                user.deleted = true
                return user
            }
        }
        throw new NotFoundException()
    }
}