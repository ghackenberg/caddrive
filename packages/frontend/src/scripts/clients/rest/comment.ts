import axios from 'axios'
// Commons
import { Comment, CommentData, CommentREST } from 'productboard-common'
// Globals
import { auth } from '../auth'

class CommentClient implements CommentREST {
    async findComments(issue: string): Promise<Comment[]> {
        return (await axios.get<Comment[]>('/rest/comments', { params: { issue }, auth })).data
    }
    async addComment(data: CommentData): Promise<Comment> {
        return (await axios.post<Comment>('/rest/comments', data, { auth })).data
    }
    async getComment(id: string): Promise<Comment> {
        return (await axios.get<Comment>(`/rest/comments/${id}`, { auth })).data
    }
    async updateComment(id: string, data: CommentData): Promise<Comment> {
        return (await axios.put<Comment>(`/rest/comments/${id}`, data, { auth })).data
    }
    async deleteComment(id: string): Promise<Comment> {
        return (await axios.delete<Comment>(`/rest/comments/${id}`, { auth })).data
    }
}

export const CommentAPI = new CommentClient()