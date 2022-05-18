import 'multer'
import * as fs from 'fs'
import * as shortid from 'shortid'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Version, VersionAddData, VersionUpdateData, VersionREST } from 'productboard-common'
import { VersionRepository } from 'productboard-database'

@Injectable()
export class VersionService implements VersionREST<VersionAddData, Express.Multer.File> {
    async findVersions(productId: string) : Promise<Version[]> {
        const result: Version[] = []
        const where = { deleted: false, productId: productId }
        for (const version of await VersionRepository.find({ where })) {
            result.push({ id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description })
        }
        return result
    }
 
    async addVersion(data: VersionAddData, file: Express.Multer.File): Promise<Version> {
        const version = await VersionRepository.save({ id: shortid(), deleted: false, ...data })
        if (file && file.originalname.endsWith('.glb')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${version.id}.glb`, file.buffer)
        }
        return { id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description }
    }

    async getVersion(id: string): Promise<Version> {
        const version = await VersionRepository.findOne({ where: { id } })
        if (version) {
            return { id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description }
        }
        throw new NotFoundException()
    }

    async updateVersion(id: string, data: VersionUpdateData, file?: Express.Multer.File): Promise<Version> {
        const version = await VersionRepository.findOne({ where: { id } })
        if (version) {
            version.major = data.major
            version.minor = data.minor
            version.patch = data.patch
            version.description = data.description
        }
        if (file && file.originalname.endsWith('.glb')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${version.id}.glb`, file.buffer)
        }
        await VersionRepository.save(version)
        return { id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description }
    }

    async deleteVersion(id: string): Promise<Version> {
        const version = await VersionRepository.findOne({ where: { id } })
        if (version) {
            version.deleted = true
            await VersionRepository.save(version)
            return { id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description }
        }
        throw new NotFoundException()
    }
}