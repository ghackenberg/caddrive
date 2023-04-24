import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { HttpException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'

import { Request } from 'express'
import 'multer'
import shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { Version, VersionAddData, VersionUpdateData, VersionREST, User } from 'productboard-common'
import { Database, VersionEntity } from 'productboard-database'

import { renderGlb, renderLDraw } from '../../../functions/render'

@Injectable()
export class VersionService implements VersionREST<VersionAddData, VersionUpdateData, Express.Multer.File[], Express.Multer.File[]> {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request & { user: User & { permissions: string[] }},
        @Inject('MQTT')
        private readonly client: ClientProxy
    ) {
        if (!existsSync('./uploads')) {
            mkdirSync('./uploads')
        }
    }

    async findVersions(productId: string) : Promise<Version[]> {
        let where: FindOptionsWhere<VersionEntity>
        if (productId)
            where = { productId, deleted: false }
        const result: Version[] = []
        for (const version of await Database.get().versionRepository.findBy(where))
            result.push(this.convert(version))
        return result
    }
 
    async addVersion(data: VersionAddData, files: {model: Express.Multer.File[], image: Express.Multer.File[]}): Promise<Version> {
        const id = shortid()
        const deleted = false
        const userId = this.request.user.id
        const time = new Date().toISOString()
        const modelType = await processModel(id, null, files)
        const imageType = await processImage(id, null, files)
        const version = await Database.get().versionRepository.save({ id, deleted, userId, time, modelType, imageType, ...data })
        await this.client.emit(`/api/v1/versions/${version.id}/create`, this.convert(version))
        return this.convert(version)
    }

    async getVersion(id: string): Promise<Version> {
        const version = await Database.get().versionRepository.findOneByOrFail({ id })
        return this.convert(version)
    }

    async updateVersion(id: string, data: VersionUpdateData, files?: {model: Express.Multer.File[], image: Express.Multer.File[]}): Promise<Version> {
        const version = await Database.get().versionRepository.findOneByOrFail({ id })
        version.major = data.major
        version.minor = data.minor
        version.patch = data.patch
        version.description = data.description
        version.modelType = await processModel(id, version.modelType, files)
        version.imageType = await processImage(id, version.imageType, files)
        await Database.get().versionRepository.save(version)
        await this.client.emit(`/api/v1/versions/${version.id}/update`, this.convert(version))
        return this.convert(version)
    }

    async deleteVersion(id: string): Promise<Version> {
        const version = await Database.get().versionRepository.findOneByOrFail({ id })
        version.deleted = true
        await Database.get().versionRepository.save(version)
        await this.client.emit(`/api/v1/versions/${version.id}/delete`, this.convert(version))
        return this.convert(version)
    }

    private convert(version: VersionEntity) {
        return { id: version.id, deleted: version.deleted, userId: version.userId, productId: version.productId, baseVersionIds: version.baseVersionIds, major:version.major, minor: version.minor, patch: version.patch, time: version.time, description: version.description, modelType: version.modelType, imageType: version.imageType }
    }
}

async function processModel(id: string, modelType: 'glb' | 'ldr' | 'mpd', files?: {model: Express.Multer.File[], image: Express.Multer.File[]}) {
    if (files) {
        if (files.model) {
            if (files.model.length == 1) {
                if (files.model[0].originalname.endsWith('.glb')) {
                    writeFileSync(`./uploads/${id}.glb`, files.model[0].buffer)
                    return 'glb'
                } else if (files.model[0].originalname.endsWith('.ldr')) {
                    writeFileSync(`./uploads/${id}.ldr`, files.model[0].buffer)
                    return 'ldr'
                } else if (files.model[0].originalname.endsWith('.mpd')) {
                    writeFileSync(`./uploads/${id}.mpd`, files.model[0].buffer)
                    return 'mpd'
                } else {
                    throw new HttpException('Model file type not supported.', 400)
                }
            } else {
                throw new HttpException('Only one model file supported.', 400)
            }
        } else {
            throw new HttpException('Model file must be provided.', 400)
        }
    } else {
        if (modelType) {
            return modelType
        } else {
            throw new HttpException('Model file must be provided.', 400)
        }
    }
}

async function processImage(id: string, imageType: 'png', files?: {model: Express.Multer.File[], image: Express.Multer.File[]}) {
    if (files) {
        if (files.image) {
            if (files.image.length == 1) {
                if (files.image[0].mimetype == 'image/png') {
                    writeFileSync(`./uploads/${id}.png`, files.image[0].buffer)
                    return 'png'
                } else {
                    throw new HttpException('Image file type not supported.', 400)
                }
            } else {
                throw new HttpException('Only one image file supported.', 400)
            }
        } else if (files.model) {
            if (files.model.length == 1) {
                if (files.model[0].originalname.endsWith('.glb')) {
                    const image = await renderGlb(files.model[0].buffer, 1000, 1000)
                    await image.writeAsync(`./uploads/${id}.png`)
                } else if (files.model[0].originalname.endsWith('.ldr')) {
                    const image = await renderLDraw(files.model[0].buffer.toString(), 1000, 1000)
                    await image.writeAsync(`./uploads/${id}.png`)
                } else if (files.model[0].originalname.endsWith('.mpd')) {
                    const image = await renderLDraw(files.model[0].buffer.toString(), 1000, 1000)
                    await image.writeAsync(`./uploads/${id}.png`)
                } else {
                    throw new HttpException('Model file type not supported.', 400)
                }
                return 'png' // We render it ourselves
            } else {
                throw new HttpException('Only one model file supported.', 400)
            }
        } else {
            throw new HttpException('Image or model file must be provided.', 400)
        }
    } else {
        if (imageType) {
            return imageType
        } else {
            throw new HttpException('Image or model file must be provided.', 400)
        }
    }
}