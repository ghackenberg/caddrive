import axios from 'axios'

import { AttachmentCreate, AttachmentREST, AttachmentRead, AttachmentUpdate } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class AttachmentClientImpl implements AttachmentREST<AttachmentCreate, AttachmentUpdate, File> {
    async findAttachments(productId: string): Promise<AttachmentRead[]> {
        return (await axios.get<AttachmentRead[]>(`/rest/products/${productId}/attachments`, auth)).data
    }
    async addAttachment(productId: string, data: AttachmentCreate, file: File): Promise<AttachmentRead> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        const attachment = (await axios.post<AttachmentRead>(`/rest/products/${productId}/attachments`, body, auth)).data
        CacheAPI.putAttachment(attachment)
        return attachment
    }
    async getAttachment(productId: string, attachmentId: string): Promise<AttachmentRead> {
        return (await axios.get<AttachmentRead>(`/rest/products/${productId}/attachments/${attachmentId}`, { ...auth })).data
    }
    async updateAttachment(productId: string, attachmentId: string, data: AttachmentUpdate, file: File): Promise<AttachmentRead> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        const attachment = (await axios.put<AttachmentRead>(`/rest/products/${productId}/attachments/${attachmentId}`, body, auth)).data
        CacheAPI.putAttachment(attachment)
        return attachment
    }
    async deleteAttachment(productId: string, attachmentId: string): Promise<AttachmentRead> {
        const attachment = (await axios.delete<AttachmentRead>(`/rest/products/${productId}/attachments/${attachmentId}`, auth)).data
        CacheAPI.putAttachment(attachment)
        return attachment
    }
}

export const AttachmentClient = new AttachmentClientImpl()