import { Injectable } from '@nestjs/common'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Attachment, AttachmentAddData, AttachmentREST, AttachmentUpdateData } from "productboard-common"
import { Database, AttachmentEntity } from 'productboard-database'

import { convertAttachment } from '../../../functions/convert'

@Injectable()
export class AttachmentService implements AttachmentREST {
 
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

    async addAttachment(data: AttachmentAddData): Promise<Attachment> {
        const id = shortid()
        const created = Date.now()
        const attachment = await Database.get().attachmentRepository.save({id: id, created: created, ...data})
        return convertAttachment(attachment)
    }
    async getAttachment(id: string): Promise<Attachment> {
        const attachment = await Database.get().attachmentRepository.findOneByOrFail({ id })
        return convertAttachment(attachment)
    }
    async updateAttachment(id: string, data: AttachmentUpdateData): Promise<Attachment> {
        const attachment = await Database.get().attachmentRepository.findOneByOrFail({ id })
        attachment.updated = Date.now()
        attachment.name = data.name
        attachment.description = data.description
        attachment.type = data.type
        attachment.data = data.data
        await Database.get().attachmentRepository.save(attachment)
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