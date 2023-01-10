import * as fs from 'fs'

import { Injectable } from '@nestjs/common'
import { Client, ClientProxy, Transport } from '@nestjs/microservices'

import 'multer'
import * as shortid from 'shortid'
import { FindOptionsWhere, Raw } from 'typeorm'

import { User, UserAddData, UserUpdateData, UserREST } from 'productboard-common'
import { getMemberOrFail, MemberRepository, UserEntity, UserRepository } from 'productboard-database'

@Injectable()
export class UserService implements UserREST<UserAddData, Express.Multer.File> {
    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    async checkUser(): Promise<User> {
        return null
    }

    async findUsers(query?: string, productId?: string) : Promise<User[]> {
        let where: FindOptionsWhere<UserEntity>
        if (query)
            where = { name: Raw(alias => `LOWER(${alias}) LIKE LOWER('%${query}%')`), deleted: false }
        else
            where = { deleted: false }
        const result: User[] = []
        for (const user of await UserRepository.findBy(where))
            try {
                if (productId) {
                    await getMemberOrFail({ userId: user.id, productId, deleted: false }, Error)
                } else {
                    throw new Error()
                }
            } catch (error) {
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
        await this.client.emit(`/api/v1/users/${user.id}/create`, this.convert(user))
        return this.convert(user)
    }

    async getUser(id: string): Promise<User> {
        const user = await UserRepository.findOneByOrFail({ id })
        return this.convert(user)
    }

    async updateUser(id: string, data: UserUpdateData, file?: Express.Multer.File): Promise<User> {
        const user = await UserRepository.findOneByOrFail({ id })
        user.email = data.email
        user.name = data.name
        if (file && file.originalname.endsWith('.jpg')) {
            user.pictureId = shortid()
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${user.pictureId}.jpg`, file.buffer)
        }
        await UserRepository.save(user)
        await this.client.emit(`/api/v1/users/${user.id}/update`, this.convert(user))
        return this.convert(user)
    }

    async deleteUser(id: string): Promise<User> {
        const user = await UserRepository.findOneByOrFail({ id })
        await MemberRepository.update({ userId: user.id }, { deleted: true })
        user.deleted = true
        await UserRepository.save(user)
        await this.client.emit(`/api/v1/users/${user.id}/delete`, this.convert(user))
        return this.convert(user)
    }

    private convert(user: UserEntity) {
        return { id: user.id, deleted: user.deleted, email: user.email, name: user.name, pictureId: user.pictureId }
    }
}