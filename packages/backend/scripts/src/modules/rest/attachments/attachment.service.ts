import { ReadStream, createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs'

import { Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import shortid from 'shortid'
import { IsNull } from 'typeorm'

import { Attachment, AttachmentAddData, AttachmentREST, AttachmentUpdateData } from 'productboard-common'
import { Database, convertAttachment } from 'productboard-database'

import { emitProductMessage } from '../../../functions/emit'
import { AuthorizedRequest } from '../../../request'

export class AttachmentService implements AttachmentREST<AttachmentAddData, AttachmentUpdateData, Express.Multer.File> {

    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {
        if (!existsSync('./uploads')) {
            mkdirSync('./uploads')
        }
    }

    async findAttachments(productId: string): Promise<Attachment[]> {
        const where = { productId, deleted: IsNull() }
        const result: Attachment[] = []
        for (const attachment of await Database.get().attachmentRepository.findBy(where))
            result.push(convertAttachment(attachment))
        return result
    }

    async addAttachment(productId: string, data: AttachmentAddData, file: Express.Multer.File): Promise<Attachment> {
        const attachmentId = shortid()
        // Save file
        writeFileSync(`./uploads/${attachmentId}`, file.buffer)
        // Add attachment
        const created = Date.now()
        const updated = created
        const userId = this.request.user.userId
        const attachment = await Database.get().attachmentRepository.save({ productId, attachmentId, created, updated, userId, ...data })
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = attachment.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], attachments: [attachment] })
        // Return attachment
        return convertAttachment(attachment)
    }

    async getAttachment(productId: string, attachmentId: string): Promise<Attachment> {
        const attachment = await Database.get().attachmentRepository.findOneByOrFail({ productId, attachmentId })
        return convertAttachment(attachment)
    }

    async getAttachmentFile(_productId: string, attachmentId: string): Promise<ReadStream> {
        return createReadStream(`./uploads/${attachmentId}`)
    }

    async updateAttachment(productId: string, attachmentId: string, data: AttachmentUpdateData, file?: Express.Multer.File): Promise<Attachment> {
        // Save file
        writeFileSync(`./uploads/${attachmentId}`, file.buffer)
        // Update attachment
        const attachment = await Database.get().attachmentRepository.findOneByOrFail({ productId, attachmentId })
        attachment.updated = Date.now()
        attachment.type = data.type
        await Database.get().attachmentRepository.save(attachment)
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = attachment.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], attachments: [attachment] })
        // Return attachment
        return convertAttachment(attachment)
    }

    async deleteAttachment(productId: string, attachmentId: string): Promise<Attachment> {
        // Delete attachment
        const attachment = await Database.get().attachmentRepository.findOneByOrFail({ productId, attachmentId })
        attachment.deleted = Date.now()
        attachment.updated = attachment.deleted
        await Database.get().attachmentRepository.save(attachment)
        // Update product
        const product = await Database.get().productRepository.findOneBy({ productId })
        product.updated = attachment.updated
        await Database.get().productRepository.save(product)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', products: [product], attachments: [attachment] })
        // Return attachment
        return convertAttachment(attachment)
    }
    
}