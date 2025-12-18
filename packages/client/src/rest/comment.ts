import axios from 'axios'

import { CommentCreate, CommentREST, CommentRead, CommentUpdate } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class CommentClientImpl implements CommentREST {
    async findComments(productId: string, issueId: string): Promise<CommentRead[]> {
        return (await axios.get<CommentRead[]>(`/rest/products/${productId}/issues/${issueId}/comments`, auth)).data
    }
    async addComment(productId: string, issueId: string, data: CommentCreate): Promise<CommentRead> {
        const comment = (await axios.post<CommentRead>(`/rest/products/${productId}/issues/${issueId}/comments`, data, auth)).data
        CacheAPI.putComment(comment)
        return comment
    }
    async getComment(productId: string, issueId: string, commentId: string): Promise<CommentRead> {
        return (await axios.get<CommentRead>(`/rest/products/${productId}/issues/${issueId}/comments/${commentId}`, auth)).data
    }
    async updateComment(productId: string, issueId: string, commentId: string, data: CommentUpdate): Promise<CommentRead> {
        const comment = (await axios.put<CommentRead>(`/rest/products/${productId}/issues/${issueId}/comments/${commentId}`, data, auth)).data
        CacheAPI.putComment(comment)
        return comment
    }
    async deleteComment(productId: string, issueId: string, commentId: string): Promise<CommentRead> {
        const comment = (await axios.delete<CommentRead>(`/rest/products/${productId}/issues/${issueId}/comments/${commentId}`, auth)).data
        CacheAPI.putComment(comment)
        return comment
    }
}

export const CommentClient = new CommentClientImpl()