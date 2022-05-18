import 'multer'
import * as fs from 'fs'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { User, UserAddData, UserUpdateData, UserREST } from 'productboard-common'
import { MemberRepository, UserEntity, UserRepository } from 'productboard-database'
import { Like } from 'typeorm'

@Injectable()
export class UserService implements UserREST<UserAddData, Express.Multer.File> {
    async checkUser(): Promise<User> {
        return null
    }

    async findUsers(query?: string, productId?: string) : Promise<User[]> {
        const result: User[] = []
        const where = query ? { deleted: false, name: Like(`%${query}%`) } : { deleted: false }
        for (const user of await UserRepository.find( { where })) {
            if (productId && await (await MemberRepository.find({ where: { productId: productId, userId: user.id } })).length > 0) {
                continue
            }
            result.push(this.convert(user))
        }
        return result
    }

    async addUser(data: UserAddData, file?: Express.Multer.File) {
        const user = await UserRepository.save({ id: shortid(), deleted: false, pictureId: shortid(), ...data })
        if (file && file.originalname.endsWith('.jpg')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${user.pictureId}.jpg`, file.buffer)
        }
        return this.convert(user)
    }

    async getUser(id: string): Promise<User> {
        const user = await UserRepository.findOne({ where: { id } })
        if (user) {
            return this.convert(user)
        }
        throw new NotFoundException()
    }

    async updateUser(id: string, data: UserUpdateData, file?: Express.Multer.File): Promise<User> {
        const user = await UserRepository.findOne({ where: { id } })
        if (user) {
            user.email = data.email
            user.password = data.password
            user.name = data.name
            if (file && file.originalname.endsWith('.jpg')) {
                user.pictureId = shortid()
                if (!fs.existsSync('./uploads')) {
                    fs.mkdirSync('./uploads')
                }
                fs.writeFileSync(`./uploads/${user.pictureId}.jpg`, file.buffer)
            }
            await UserRepository.save(user)
            return this.convert(user)
        }
        throw new NotFoundException()
    }

    async deleteUser(id: string): Promise<User> {
        const user = await UserRepository.findOne({ where: { id } })
        if (user) {
            user.deleted = true
            await UserRepository.save(user)
            return this.convert(user)
        }
        throw new NotFoundException()
    }

    private convert(user: UserEntity) {
        return { id: user.id, deleted: user.deleted, email: user.email, name: user.name, password: user.password, pictureId: user.pictureId }
    }
}