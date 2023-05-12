import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import 'multer'
import shortid from 'shortid'
import { FindOptionsWhere, IsNull, Raw } from 'typeorm'

import { User, UserUpdateData, UserREST } from 'productboard-common'
import { Database, getMemberOrFail, UserEntity } from 'productboard-database'

import { convertUser } from '../../../functions/convert'
import { AuthorizedRequest } from '../../../request'

@Injectable()
export class UserService implements UserREST<UserUpdateData, Express.Multer.File> {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {
        if (!existsSync('./uploads')) {
            mkdirSync('./uploads')
        }
    }

    async findUsers(query?: string, productId?: string) : Promise<User[]> {
        let where: FindOptionsWhere<UserEntity>
        if (query)
            where = { name: Raw(alias => `LOWER(${alias}) LIKE LOWER('%${query}%')`), deleted: IsNull() }
        else
            where = { deleted: IsNull() }
        const result: User[] = []
        for (const user of await Database.get().userRepository.findBy(where))
            try {
                if (productId) {
                    await getMemberOrFail({ userId: user.id, productId }, Error)
                } else {
                    throw new Error()
                }
            } catch (error) {
                result.push(convertUser(user, this.request.user && this.request.user.id == user.id))
            }
        return result
    }

    async getUser(id: string): Promise<User> {
        const user = await Database.get().userRepository.findOneByOrFail({ id })
        return convertUser(user, this.request.user && this.request.user.id == id)
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
        return convertUser(user, this.request.user && this.request.user.id == id)
    }

    async deleteUser(id: string): Promise<User> {
        const user = await Database.get().userRepository.findOneByOrFail({ id })
        user.deleted = Date.now()
        user.updated = user.deleted
        await Database.get().memberRepository.update({ userId: user.id }, { deleted: user.deleted, updated: user.updated })
        await Database.get().userRepository.save(user)
        return convertUser(user, this.request.user && this.request.user.id == id)
    }
}