import axios from 'axios'

import { Attachment, AttachmentAddData, AttachmentUpdateData, AttachmentREST } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class AttachmentClientImpl implements AttachmentREST<AttachmentAddData, AttachmentUpdateData, File> {
    async findAttachments(productId: string): Promise<Attachment[]> {
        return (await axios.get<Attachment[]>(`/rest/products/${productId}/attachments`, auth)).data
    }
    async addAttachment(productId: string, data: AttachmentAddData): Promise<Attachment> {
        const issue = (await axios.post<Attachment>(`/rest/products/${productId}/attachments`, data, auth)).data
        CacheAPI.putAttachment(issue)
        return issue
    }
    async getAttachment(productId: string, issueId: string): Promise<Attachment> {
        return (await axios.get<Attachment>(`/rest/products/${productId}/attachments/${issueId}`, { ...auth })).data
    }
    async updateAttachment(productId: string, issueId: string, data: AttachmentUpdateData): Promise<Attachment> {
        const issue = (await axios.put<Attachment>(`/rest/products/${productId}/attachments/${issueId}`, data, auth)).data
        CacheAPI.putAttachment(issue)
        return issue
    }
    async deleteAttachment(productId: string, issueId: string): Promise<Attachment> {
        const issue = (await axios.delete<Attachment>(`/rest/products/${productId}/attachments/${issueId}`, auth)).data
        CacheAPI.putAttachment(issue)
        return issue
    }
}

export const AttachmentClient = new AttachmentClientImpl()