import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'

import 'multer'
import shortid from 'shortid'
import { FindOptionsWhere, Raw } from 'typeorm'

import { User, UserUpdateData, UserREST } from 'productboard-common'
import { Database, getMemberOrFail, UserEntity } from 'productboard-database'

import { convertUser } from '../../../functions/convert'
import { AuthorizedRequest } from '../../../request'

@Injectable()
export class UserService implements UserREST<UserUpdateData, Express.Multer.File> {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest,
        @Inject('MQTT')
        private readonly client: ClientProxy
    ) {
        if (!existsSync('./uploads')) {
            mkdirSync('./uploads')
        }
    }

    async findUsers(query?: string, productId?: string) : Promise<User[]> {
        let where: FindOptionsWhere<UserEntity>
        if (query)
            where = { name: Raw(alias => `LOWER(${alias}) LIKE LOWER('%${query}%')`) }
        else
            where = { deleted: null }
        const result: User[] = []
        for (const user of await Database.get().userRepository.findBy(where))
            try {
                if (productId) {
                    await getMemberOrFail({ userId: user.id, productId }, Error)
                } else {
                    throw new Error()
                }
            } catch (error) {
                result.push(convertUser(user, this.request.user.id == user.id))
            }
        return result
    }

    async getUser(id: string): Promise<User> {
        const user = await Database.get().userRepository.findOneByOrFail({ id })
        return convertUser(user, this.request.user.id == id)
    }

    async updateUser(id: string, data: UserUpdateData, file?: Express.Multer.File): Promise<User> {
        const user = await Database.get().userRepository.findOneByOrFail({ id })
        user.updated = Date.now()
        user.consent = data.consent
        user.name = data.name
        if (file && file.originalname.endsWith('.jpg')) {
            user.pictureId = shortid()
            writeFileSync(`./uploads/${user.pictureId}.jpg`, file.buffer)
        }
        await Database.get().userRepository.save(user)
        await this.client.emit(`/api/v1/users/${user.id}/update`, convertUser(user, this.request.user.id == id))
        return convertUser(user, this.request.user.id == id)
    }

    async deleteUser(id: string): Promise<User> {
        const user = await Database.get().userRepository.findOneByOrFail({ id })
        await Database.get().memberRepository.update({ userId: user.id }, { deleted: Date.now() })
        user.deleted = Date.now()
        await Database.get().userRepository.save(user)
        await this.client.emit(`/api/v1/users/${user.id}/delete`, convertUser(user, this.request.user.id == id))
        return convertUser(user, this.request.user.id == id)
    }
}