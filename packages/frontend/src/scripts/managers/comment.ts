import { Comment, CommentData, CommentREST } from 'productboard-common'
import { CommentAPI } from '../clients/rest/comment'

class CommentManagerImpl implements CommentREST {
    async findComments(issueId: string): Promise<Comment[]> {
        return CommentAPI.findComments(issueId)
    }
    async addComment(data: CommentData): Promise<Comment> {
        return CommentAPI.addComment(data)
    }
    async getComment(id: string): Promise<Comment> {
        return CommentAPI.getComment(id)
    }
    async updateComment(id: string, data: CommentData): Promise<Comment> {
        return CommentAPI.updateComment(id, data)
    }
    async deleteComment(id: string): Promise<Comment> {
        return CommentAPI.deleteComment(id)
    }
}

export const CommentManager = new CommentManagerImpl()