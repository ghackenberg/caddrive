import axios from 'axios'

import { Attachment, AttachmentAddData, AttachmentUpdateData, AttachmentREST } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class AttachmentClientImpl implements AttachmentREST<AttachmentAddData, AttachmentUpdateData, File> {
    async findAttachments(productId: string): Promise<Attachment[]> {
        return (await axios.get<Attachment[]>(`/rest/products/${productId}/attachments`, auth)).data
    }
    async addAttachment(productId: string, data: AttachmentAddData, file: File): Promise<Attachment> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        const attachment = (await axios.post<Attachment>(`/rest/products/${productId}/attachments`, body, auth)).data
        CacheAPI.putAttachment(attachment)
        return attachment
    }
    async getAttachment(productId: string, attachmentId: string): Promise<Attachment> {
        return (await axios.get<Attachment>(`/rest/products/${productId}/attachments/${attachmentId}`, { ...auth })).data
    }
    async updateAttachment(productId: string, attachmentId: string, data: AttachmentUpdateData, file: File): Promise<Attachment> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        const attachment = (await axios.put<Attachment>(`/rest/products/${productId}/attachments/${attachmentId}`, body, auth)).data
        CacheAPI.putAttachment(attachment)
        return attachment
    }
    async deleteAttachment(productId: string, attachmentId: string): Promise<Attachment> {
        const attachment = (await axios.delete<Attachment>(`/rest/products/${productId}/attachments/${attachmentId}`, auth)).data
        CacheAPI.putAttachment(attachment)
        return attachment
    }
}

export const AttachmentClient = new AttachmentClientImpl()