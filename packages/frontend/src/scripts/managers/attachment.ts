import { Attachment, AttachmentAddData, AttachmentUpdateData } from 'productboard-common'

import { AttachmentClient } from '../clients/rest/attachment'
import { AbstractManager } from './abstract'

class AttachmentManagerImpl extends AbstractManager<Attachment> {
    // CACHE
    
    findAttachmentsFromCache(commentId?: string, issueId?: string) { 
        return this.getFind(`${commentId}-${issueId}`)
    }
    getAttachmentFromCache(commentId: string) { 
        return this.getItem(commentId)
    }

    // REST
    
    findAttachments(commentId: string, issueId: string, callback: (comments: Attachment[], error?: string) => void) {
        return this.find(
            `${commentId}-${issueId}`,
            () => AttachmentClient.findAttachments(commentId, issueId),
            // TODO: fix cache
            attachment => (!commentId || attachment.commentId == commentId),
            (a, b) => a.created - b.created,
            callback
        )
    }
    async addAttachment(data: AttachmentAddData, files: { audio?: Blob, image?: File, pdf?: File}) {
        return this.resolveItem(await AttachmentClient.addAttachment(data, files))
    }
    getAttachment(id: string, callback: (comment: Attachment, error?: string) => void) {
        return this.observeItem(id, () => AttachmentClient.getAttachment(id), callback)
    }
    async updateAttachment(id: string, data: AttachmentUpdateData, files?: { audio?: Blob, image?: File, pdf?: File }) {
        return this.promiseItem(id, AttachmentClient.updateAttachment(id, data, files))
    }
    async deleteAttachment(id: string) {
        return this.promiseItem(id, AttachmentClient.deleteAttachment(id))
    }
}

export const AttachmentManager = new AttachmentManagerImpl('attachment')