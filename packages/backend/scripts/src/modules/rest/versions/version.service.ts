import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { HttpException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import Jimp from 'jimp'
import 'multer'
import { getTestMessageUrl } from 'nodemailer'
import shortid from 'shortid'
import { IsNull } from 'typeorm'

import { Version, VersionAddData, VersionUpdateData, VersionREST, Product } from 'productboard-common'
import { Database, convertVersion } from 'productboard-database'

import { emitProductMessage } from '../../../functions/emit'
import { TRANSPORTER } from '../../../functions/mail'
import { renderGlb, renderLDraw } from '../../../functions/render'
import { AuthorizedRequest } from '../../../request'

@Injectable()
export class VersionService implements VersionREST<VersionAddData, VersionUpdateData, Express.Multer.File[], Express.Multer.File[]> {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {
        if (!existsSync('./uploads')) {
            mkdirSync('./uploads')
        }
    }

    async findVersions(productId: string) : Promise<Version[]> {
        const where = { productId, deleted: IsNull() }
        const result: Version[] = []
        for (const version of await Database.get().versionRepository.findBy(where))
            result.push(convertVersion(version))
        return result
    }
 
    async addVersion(productId: string, data: VersionAddData, files: {model: Express.Multer.File[], image: Express.Multer.File[]}): Promise<Version> {
        // Create version
        const versionId = shortid()
        const created = Date.now()
        const updated = created
        const userId = this.request.user.userId
        const modelType = await this.processModel(versionId, null, files)
        const imageType = await this.processImage(versionId, null, files)
        const version = await Database.get().versionRepository.save({ productId, versionId, created, updated, userId, modelType, imageType, ...data })
        // Render image
        this.renderImage(productId, versionId, files)
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = version.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], versions: [version] })
        // Return version
        return convertVersion(version)
    }

    async getVersion(productId: string, versionId: string): Promise<Version> {
        const version = await Database.get().versionRepository.findOneByOrFail({ productId, versionId })
        return convertVersion(version)
    }

    async updateVersion(productId: string, versionId: string, data: VersionUpdateData, files?: {model: Express.Multer.File[], image: Express.Multer.File[]}): Promise<Version> {
        // Update version
        const version = await Database.get().versionRepository.findOneByOrFail({ productId, versionId })
        version.updated = Date.now()
        version.major = data.major
        version.minor = data.minor
        version.patch = data.patch
        version.description = data.description
        version.modelType = await this.processModel(versionId, version.modelType, files)
        version.imageType = await this.processImage(versionId, version.imageType, files)
        await Database.get().versionRepository.save(version)
        // Render image
        this.renderImage(productId, versionId, files)
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = version.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], versions: [version] })
        // Return version
        return convertVersion(version)
    }

    async deleteVersion(productId: string, versionId: string): Promise<Version> {
        // Delete version
        const version = await Database.get().versionRepository.findOneByOrFail({ productId, versionId })
        version.deleted = Date.now()
        version.updated = version.deleted
        await Database.get().versionRepository.save(version)
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = version.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], versions: [version] })
        // Return version
        return convertVersion(version)
    }

    async processModel(versionId: string, modelType: 'glb' | 'ldr' | 'mpd', files?: {model: Express.Multer.File[], image: Express.Multer.File[]}) {
        if (files) {
            if (files.model) {
                if (files.model.length == 1) {
                    if (files.model[0].originalname.endsWith('.glb')) {
                        writeFileSync(`./uploads/${versionId}.glb`, files.model[0].buffer)
                        return 'glb'
                    } else if (files.model[0].originalname.endsWith('.ldr')) {
                        writeFileSync(`./uploads/${versionId}.ldr`, files.model[0].buffer)
                        return 'ldr'
                    } else if (files.model[0].originalname.endsWith('.mpd')) {
                        writeFileSync(`./uploads/${versionId}.mpd`, files.model[0].buffer)
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
    
    async processImage(versionId: string, imageType: 'png', files?: {model: Express.Multer.File[], image: Express.Multer.File[]}) {
        if (files) {
            if (files.image) {
                if (files.image.length == 1) {
                    if (files.image[0].mimetype == 'image/png') {
                        writeFileSync(`./uploads/${versionId}.png`, files.image[0].buffer)
                        return 'png'
                    } else {
                        throw new HttpException('Image file type not supported.', 400)
                    }
                } else {
                    throw new HttpException('Only one image file supported.', 400)
                }
            } else if (files.model) {
                // Render model later
                return null
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
    
    async renderImage(productId: string, versionId: string, files?: {model: Express.Multer.File[], image: Express.Multer.File[]}) {
        if (files) {
            if (files.image) {
                // Model must not be rendered
            } else if (files.model) {
                if (files.model.length == 1) {
                    if (files.model[0].originalname.endsWith('.glb')) {
                        const image = await renderGlb(files.model[0].buffer, 1000, 1000)
                        await this.updateImage(productId, versionId, image)
                    } else if (files.model[0].originalname.endsWith('.ldr')) {
                        const image = await renderLDraw(files.model[0].buffer.toString(), 1000, 1000)
                        await this.updateImage(productId, versionId, image)
                    } else if (files.model[0].originalname.endsWith('.mpd')) {
                        const image = await renderLDraw(files.model[0].buffer.toString(), 1000, 1000)
                        await this.updateImage(productId, versionId, image)
                    } else {
                        throw new HttpException('Model file type not supported.', 400)
                    }
                } else {
                    throw new HttpException('Only one model file supported.', 400)
                }
            } else {
                throw new HttpException('Image or model file must be provided.', 400)
            }
        }
    }
    
    async updateImage(productId: string, versionId: string, image: Jimp) {
        // Save image
        await image.writeAsync(`./uploads/${versionId}.png`)
        // Update version
        const version = await Database.get().versionRepository.findOneBy({ productId, versionId })
        version.updated = Date.now()
        version.imageType = 'png'
        await Database.get().versionRepository.save(version)
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = version.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], versions: [version] })
        // Notify changes
        this.notifyAddOrUpdateVersion(product, version)
    }

    async notifyAddOrUpdateVersion(product: Product, version: Version) {
        // Send emails
        const members = await Database.get().memberRepository.findBy({ productId: product.productId, deleted: IsNull() })
        for (const member of members) {
            if (member.userId != this.request.user.userId) {
                const user = await Database.get().userRepository.findOneBy({ userId: member.userId, deleted: IsNull() })
                const transporter = await TRANSPORTER
                const info = await transporter.sendMail({
                    from: 'CADdrive <mail@caddrive.com>',
                    to: user.email,
                    subject: 'Version notification',
                    templateName: 'version',
                    templateData: {
                        user: this.request.user.name,
                        date: new Date(version.updated).toDateString(),
                        product: product.name,
                        major: version.major,
                        minor: version.minor,
                        patch: version.patch,
                        comment: version.description,
                        image: `https://caddrive.com/rest/files/${version.versionId}.${version.imageType}`,
                        link: `https://caddrive.com/products/${product.productId}`
                    }
                })
                console.log(getTestMessageUrl(info))
            }
        }
    }
}