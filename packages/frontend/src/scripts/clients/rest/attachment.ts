import axios from 'axios'

import { Attachment, AttachmentAddData, AttachmentREST, AttachmentUpdateData } from 'productboard-common'

import { auth } from '../auth'

class AttachmentClientImpl implements AttachmentREST<AttachmentAddData, AttachmentUpdateData, Blob, File> {
    async findAttachments(comment?: string, issue?: string): Promise<Attachment[]> {
        return (await axios.get<Attachment[]>('/rest/attachments', { params: { comment, issue }, ...auth } )).data
    }
    async addAttachment(data: AttachmentAddData, files: { audio?: Blob, image?: File }): Promise<Attachment> {
        
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files.audio) {
            body.append('audio', files.audio)
        }
        if (files.image) {
            body.append('image', files.image)
        }
        return (await axios.post<Attachment>('/rest/attachments', body, { ...auth })).data
    }
    async getAttachment(id: string): Promise<Attachment> {
        return (await axios.get<Attachment>(`/rest/attachments/${id}`, { ...auth })).data
    }
    async updateAttachment(id: string, data: AttachmentUpdateData, files?: { audio?: Blob, image?: File }): Promise<Attachment> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files) {
            if (files.audio) {
                body.append('audio', files.audio)
            }
            if (files.image) {
                body.append('image', files.image)
            }
        }
        return (await axios.put<Attachment>(`/rest/attachments/${id}`, body, { ...auth })).data
    }
    async deleteAttachment(id: string): Promise<Attachment> {
        return (await axios.delete<Attachment>(`/rest/attachments/${id}`, { ...auth })).data
    }
}

export const AttachmentClient = new AttachmentClientImpl()