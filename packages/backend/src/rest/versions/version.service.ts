import 'multer'
import * as fs from 'fs'
import * as shortid from 'shortid'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Version, VersionAddData, VersionUpdateData, VersionREST } from 'productboard-common'
import { InjectRepository } from '@nestjs/typeorm'
//import { ProductEntity } from '../products/product.entity'
import { VersionEntity } from './version.entity'
import { Repository } from 'typeorm'

@Injectable()
export class VersionService implements VersionREST<VersionAddData, Express.Multer.File> {
    private static readonly versions: Version[] = [
        { id: 'demo-1', userId: 'demo-1', productId: 'demo-1', baseVersionIds: [], time: new Date().toISOString(), major: 1, minor: 0, patch: 0, description: 'Platform design completed.', deleted: false },
        { id: 'demo-2', userId: 'demo-1', productId: 'demo-1', baseVersionIds: ['demo-1'], time: new Date().toISOString(), major: 1, minor: 1, patch: 0, description: 'Winter version of the vehicle.', deleted: false },
        { id: 'demo-3', userId: 'demo-2', productId: 'demo-1', baseVersionIds: ['demo-1'], time: new Date().toISOString(), major: 1, minor: 2, patch: 0, description: 'Summer version of the vehicle.', deleted: false },
        { id: 'demo-4', userId: 'demo-2', productId: 'demo-2', baseVersionIds: [], time: new Date().toISOString(), major: 1, minor: 0, patch: 0, description: 'Initial commit.', deleted: false }
    ]

    constructor(
        @InjectRepository(VersionEntity)
        private readonly versionRepository: Repository <VersionEntity>
    ) {
        this.versionRepository.count().then(async count => {
            if (count == 0) {
                for (const _version of VersionService.versions) {
                    // await this.versionRepository.save(version)
                }
            }
        })
    }

    async findVersions(productId: string) : Promise<Version[]> {
        const result: Version[] = []
         const where = { deleted: false, productId: productId }
        for (const version of await this.versionRepository.find({ where })) {
                result.push({ id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description })
            }
        return result
    }
 
    async addVersion(data: VersionAddData, file: Express.Multer.File): Promise<Version> {
        const version = await this.versionRepository.save({ id: shortid(), deleted: false, ...data })
        if (file && file.originalname.endsWith('.glb')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${version.id}.glb`, file.buffer)
        }
        console.log(version.baseVersionIds)
        return { id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description }
    }

    async getVersion(id: string): Promise<Version> {
        const version = await this.versionRepository.findOne(id)
        if (version) {
            return { id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description }
        }
        throw new NotFoundException()
    }

    async updateVersion(id: string, data: VersionUpdateData, file?: Express.Multer.File): Promise<Version> {
      
        const version = await this.versionRepository.findOne(id)
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
        await this.versionRepository.save(version)
        return { id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description }
    }


    async deleteVersion(id: string): Promise<Version> {
        const version = await this.versionRepository.findOne(id)
        if (version) {
            version.deleted = true
            await this.versionRepository.save(version)
            return { id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description }
        }
        throw new NotFoundException()
    }
}