import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Jimp } from 'jimp'
import 'multer'
import { UserRead, UserREST, UserUpdate } from 'productboard-common'
import { convertUser, Database, getMemberOrFail, UserEntity } from 'productboard-database'
import shortid from 'shortid'
import { FindOptionsWhere, IsNull, Raw } from 'typeorm'
import { emitProductMessage, emitUserMessage } from '../../../functions/emit.js'
import { AuthorizedRequest } from '../../../request.js'

@Injectable()
export class UserService implements UserREST<UserUpdate, Express.Multer.File> {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    async findUsers(productId?: string, query?: string) : Promise<UserRead[]> {
        let where: FindOptionsWhere<UserEntity>
        if (query) {
            where = { name: Raw(alias => `LOWER(${alias}) LIKE LOWER('%${query}%')`), deleted: IsNull() }
        } else {
            where = { deleted: IsNull() }   
        }
        const result: UserRead[] = []
        for (const user of await Database.get().userRepository.find({ where, order: { updated: 'DESC' }, take: 50 })) {
            try {
                if (productId) {
                    await getMemberOrFail({ productId, userId: user.userId, deleted: IsNull() }, Error)
                } else {
                    throw new Error()
                }
            } catch (error) {
                result.push(await convertUser(user, this.request.user && this.request.user.userId == user.userId))
            }
        }
        return result
    }

    async getUser(userId: string): Promise<UserRead> {
        const user = await Database.get().userRepository.findOneByOrFail({ userId })
        return convertUser(user, this.request.user && this.request.user.userId == userId)
    }

    async updateUser(userId: string, data: UserUpdate, file?: Express.Multer.File): Promise<UserRead> {
        // Update user
        const user = await Database.get().userRepository.findOneByOrFail({ userId })
        user.updated = Date.now()
        user.consent = data.consent
        user.name = data.name
        user.emailNotification = data.emailNotification
        if (file && (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/bmp' || file.mimetype == 'image/tiff' || file.mimetype == 'image/gif')) {
            // Parse
            const parsed = await Jimp.read(file.buffer)
            // Crop
            const width = parsed.width
            const height = parsed.height
            const size = Math.min(width, height)
            const cropped = parsed.crop({ x: (width - size) / 2, y: (height - size) / 2, w: size, h: size })
            // Resize
            const resized = cropped.resize({ w: 128, h: 128 })
            // Write
            const pictureId = shortid()
            await resized.write(`./uploads/${pictureId}.jpg`)
            user.pictureId = pictureId
        }
        await Database.get().userRepository.save(user)
        // Emit changes
        emitUserMessage(userId, { type: 'state', users: [user] })
        // Return user
        return convertUser(user, this.request.user && this.request.user.userId == userId)
    }

    async deleteUser(userId: string): Promise<UserRead> {
        // Delete user
        const user = await Database.get().userRepository.findOneByOrFail({ userId })
        user.deleted = Date.now()
        user.updated = user.deleted
        await Database.get().userRepository.save(user)
        // Delete members
        const members = await Database.get().memberRepository.findBy({ userId, deleted: IsNull() })
        for (const member of members) {
            member.deleted = user.deleted
            member.updated = user.deleted
            await Database.get().memberRepository.save(member)
        }
        // Emit changes
        emitUserMessage(userId, { type: 'state', users: [user] })
        for (const member of members) {
            emitProductMessage(member.productId, { type: 'patch', members: [member] })
        }
        // Return user
        return convertUser(user, this.request.user && this.request.user.userId == userId)
    }
}