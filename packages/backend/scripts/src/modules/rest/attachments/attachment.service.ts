import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { Injectable } from '@nestjs/common'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Attachment, AttachmentAddData, AttachmentREST, AttachmentUpdateData } from "productboard-common"
import { Database, AttachmentEntity } from 'productboard-database'

import { convertAttachment } from '../../../functions/convert'

@Injectable()
export class AttachmentService implements AttachmentREST<AttachmentAddData, AttachmentUpdateData, Express.Multer.File[], Express.Multer.File[], Express.Multer.File[], Express.Multer.File[]> {
    //TODO: Request like in issueservice?
    constructor(
    ) {
        if (!existsSync('./uploads')) {
            mkdirSync('./uploads')
        }
    }
    async findAttachments(commentId?: string, issueId?: string) : Promise<Attachment[]> {
        let where: FindOptionsWhere<AttachmentEntity>
        const result: Attachment[] = []
        if (commentId && !issueId) {
            where = { commentId, deleted: IsNull() }
            for (const attachment of await Database.get().attachmentRepository.findBy(where))
            result.push(convertAttachment(attachment))
        }
        else if (!commentId && issueId) {
            const comments = await Database.get().commentRepository.findBy({ issueId: issueId, deleted: IsNull()})
            for (const comment of comments ) {
                const attachments =  await Database.get().attachmentRepository.findBy({commentId: comment.id, deleted: IsNull()})
                for (const attachment of attachments) {
                    result.push(convertAttachment(attachment))
                }
            }
        }
        return result
    }

    async addAttachment(data: AttachmentAddData, files: { audio?: Express.Multer.File[], image?: Express.Multer.File[], pdf?: Express.Multer.File[], video?: Express.Multer.File[]}): Promise<Attachment> {
        let attachment: AttachmentEntity
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) { 
            const id = shortid()
            const created = Date.now()
            attachment = await Database.get().attachmentRepository.save({id: id, created: created, ...data})
            writeFileSync(`./uploads/${id}.${data.type}`, files.audio[0].buffer)
        } 
        if (files && files.image && files.image.length == 1 && ['/jpeg', 'jpg', '/png'].some(mimeType => files.image[0].mimetype.endsWith(mimeType))) { 
            const id = shortid()
            const created = Date.now()
            attachment = await Database.get().attachmentRepository.save({id: id, created: created, ...data})
            writeFileSync(`./uploads/${id}.${data.type}`, files.image[0].buffer)
        } 
        if (files && files.pdf && files.pdf.length == 1 && files.pdf[0].mimetype.endsWith('/pdf')) { 
            const id = shortid()
            const created = Date.now()
            attachment = await Database.get().attachmentRepository.save({id: id, created: created, ...data})
            writeFileSync(`./uploads/${id}.${data.type}`, files.pdf[0].buffer)
        } 
        if (files && files.video && files.video.length == 1 && ['/mp4', '/webm'].some(mimeType => files.video[0].mimetype.endsWith(mimeType))) { 
            const id = shortid()
            const created = Date.now()
            attachment = await Database.get().attachmentRepository.save({id: id, created: created, ...data})
            writeFileSync(`./uploads/${id}.${data.type}`, files.video[0].buffer)
        } 

        return convertAttachment(attachment)
    }

    async getAttachment(id: string): Promise<Attachment> {
        const attachment = await Database.get().attachmentRepository.findOneByOrFail({ id })
        return convertAttachment(attachment)
    }
    async updateAttachment(id: string, data: AttachmentUpdateData, files: { audio?: Express.Multer.File[], image?: Express.Multer.File[], pdf?: Express.Multer.File[], video?: Express.Multer.File[] }): Promise<Attachment> {
        const attachment = await Database.get().attachmentRepository.findOneByOrFail({ id })
        attachment.updated = Date.now()
        attachment.name = data.name
        attachment.description = data.description
        attachment.type = data.type
        await Database.get().attachmentRepository.save(attachment)
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            writeFileSync(`./uploads/${id}.${data.type}`, files.audio[0].buffer)
        }
        if (files && files.image && files.image.length == 1 && ['/jpeg', 'jpg', '/png'].some(mimeType => files.image[0].mimetype.endsWith(mimeType))) { 
            writeFileSync(`./uploads/${id}.${data.type}`, files.image[0].buffer)
        } 
        if (files && files.pdf && files.pdf.length == 1 && files.pdf[0].mimetype.endsWith('/pdf')) { 
            writeFileSync(`./uploads/${id}.${data.type}`, files.pdf[0].buffer)
        } 
        if (files && files.video && files.video.length == 1 && ['/mp4', '/webm'].some(mimeType => files.video[0].mimetype.endsWith(mimeType))) { 
            writeFileSync(`./uploads/${id}.${data.type}`, files.video[0].buffer)
        } 
        return convertAttachment(attachment)
    }
    async deleteAttachment(id: string): Promise<Attachment> {
        const attachment = await Database.get().attachmentRepository.findOneByOrFail({ id })
        attachment.deleted = Date.now()
        attachment.updated = Date.now()
        await Database.get().attachmentRepository.save(attachment)
        return convertAttachment(attachment)
    } 
}
