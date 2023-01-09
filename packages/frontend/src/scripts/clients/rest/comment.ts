import axios from 'axios'

import { Comment, CommentAddData, CommentUpdateData, CommentREST } from 'productboard-common'

import { auth } from '../auth'

class CommentClientImpl implements CommentREST<CommentAddData, CommentUpdateData, Blob> {
    async findComments(issue: string): Promise<Comment[]> {
        return (await axios.get<Comment[]>('/rest/comments', { params: { issue }, ...auth })).data
    }
    async addComment(data: CommentAddData, files: { audio?: Blob }): Promise<Comment> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files.audio) {
            body.append('audio', files.audio)
        }
        return (await axios.post<Comment>('/rest/comments', body, { ...auth })).data
    }
    async getComment(id: string): Promise<Comment> {
        return (await axios.get<Comment>(`/rest/comments/${id}`, { ...auth })).data
    }
    async updateComment(id: string, data: CommentUpdateData, files?: { audio?: Blob }): Promise<Comment> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files) {
            if (files.audio) {
                body.append('audio', files.audio)
            }
        }
        return (await axios.put<Comment>(`/rest/comments/${id}`, body, { ...auth })).data
    }
    async deleteComment(id: string): Promise<Comment> {
        return (await axios.delete<Comment>(`/rest/comments/${id}`, { ...auth })).data
    }
}

export const CommentClient = new CommentClientImpl()