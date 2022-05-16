import 'multer'
import * as fs from 'fs'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import * as hash from 'hash.js'
import { User, UserAddData, UserUpdateData, UserREST } from 'productboard-common'
import { Like, Repository } from 'typeorm'
import { UserEntity } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { MemberEntity } from '../members/member.entity'

@Injectable()
export class UserService implements UserREST<UserAddData, Express.Multer.File> {
    private static readonly users: User[] = [
        { id: 'demo-1', name: 'Georg Hackenberg', email: 'georg.hackenberg@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-1', deleted: false},
        { id: 'demo-2', name: 'Christian Zehetner', email: 'christian.zehetner@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-2', deleted: false },
        { id: 'demo-3', name: 'Jürgen Humenberger', email: 'juergen.humenberger@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-3', deleted: false },
        { id: 'demo-4', name: 'Dominik Frühwirth', email: 'dominik.fruehwirth@fh-wels.at', password: hash.sha256().update('test').digest('hex'), pictureId: 'demo-4', deleted: false }
    ]

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository <UserEntity>,
        @InjectRepository(MemberEntity)
        private readonly memberRepositiory: Repository <MemberEntity>
    ) {
        this.userRepository.count().then(async count => {
            if (count == 0) {
                for (const _user of UserService.users) {
                    // await this.userRepository.save(user)
                }
            }
        })
    }

    async checkUser(): Promise<User> {
        return null
    }

    async findUsers(query?: string, productId?: string) : Promise<User[]> {
        const result: User[] = []
        const where = query ? { deleted: false, name: Like(`%${query}%`) } : { deleted: false }
        for (const user of await this.userRepository.find( { where })) {
            if (productId && await (await this.memberRepositiory.find({productId: productId, userId: user.id})).length > 0) {
                continue
            }
            result.push({ id: user.id, deleted: user.deleted, email: user.email, name: user.name, password: user.password, pictureId: user.pictureId })
        }
        return result
    }

    async addUser(data: UserAddData, file?: Express.Multer.File) {
        const user = await this.userRepository.save({ id: shortid(), deleted: false, pictureId: shortid(), ...data })
        if (file && file.originalname.endsWith('.jpg')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${user.pictureId}.jpg`, file.buffer)
        }
        return { id: user.id, deleted: user.deleted, email: user.email, name: user.name, password: user.password, pictureId: user.pictureId }
    }

    async getUser(id: string): Promise<User> {
        const user = await this.userRepository.findOne(id)
        if (user) {
            return { id: user.id, deleted: user.deleted, email: user.email, name: user.name, password: user.password, pictureId: user.pictureId }
        }
        throw new NotFoundException()
    }

    async updateUser(id: string, data: UserUpdateData, file?: Express.Multer.File): Promise<User> {
        const user = await this.userRepository.findOne(id)
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
            await this.userRepository.save(user)
            return { id: user.id, deleted: user.deleted, email: user.email, name: user.name, password: user.password, pictureId: user.pictureId }
        }
        throw new NotFoundException()
    }

    async deleteUser(id: string): Promise<User> {
        const user = await this.userRepository.findOne(id)
        if (user) {
            user.deleted = true
            await this.userRepository.save(user)
            return { id: user.id, deleted: user.deleted, email: user.email, name: user.name, password: user.password, pictureId: user.pictureId }
        }
        throw new NotFoundException()
    }
}