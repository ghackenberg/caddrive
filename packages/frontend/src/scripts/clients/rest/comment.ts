import axios from 'axios'

import { Comment, CommentAddData, CommentUpdateData, CommentREST } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class CommentClientImpl implements CommentREST<CommentAddData, CommentUpdateData, Blob> {
    async findComments(productId: string, issueId: string): Promise<Comment[]> {
        return (await axios.get<Comment[]>(`/rest/products/${productId}/issues/${issueId}/comments`, auth)).data
    }
    async addComment(productId: string, issueId: string, data: CommentAddData, files: { audio?: Blob }): Promise<Comment> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files.audio) {
            body.append('audio', files.audio)
        }
        const comment = (await axios.post<Comment>(`/rest/products/${productId}/issues/${issueId}/comments`, body, auth)).data
        CacheAPI.putComment(comment)
        return comment
    }
    async getComment(productId: string, issueId: string, commentId: string): Promise<Comment> {
        return (await axios.get<Comment>(`/rest/products/${productId}/issues/${issueId}/comments/${commentId}`, auth)).data
    }
    async updateComment(productId: string, issueId: string, commentId: string, data: CommentUpdateData, files?: { audio?: Blob }): Promise<Comment> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files) {
            if (files.audio) {
                body.append('audio', files.audio)
            }
        }
        const comment = (await axios.put<Comment>(`/rest/products/${productId}/issues/${issueId}/comments/${commentId}`, body, auth)).data
        CacheAPI.putComment(comment)
        return comment
    }
    async deleteComment(productId: string, issueId: string, commentId: string, ): Promise<Comment> {
        const comment = (await axios.delete<Comment>(`/rest/products/${productId}/issues/${issueId}/comments/${commentId}`, auth)).data
        CacheAPI.putComment(comment)
        return comment
    }
}

export const CommentClient = new CommentClientImpl()