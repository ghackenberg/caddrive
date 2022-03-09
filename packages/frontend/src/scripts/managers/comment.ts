import { Comment, CommentData, CommentREST } from 'productboard-common'
import { CommentClient } from '../clients/rest/comment'

class CommentManagerImpl implements CommentREST {
    async findComments(issueId: string): Promise<Comment[]> {
        return CommentClient.findComments(issueId)
    }
    async addComment(data: CommentData): Promise<Comment> {
        return CommentClient.addComment(data)
    }
    async getComment(id: string): Promise<Comment> {
        return CommentClient.getComment(id)
    }
    async updateComment(id: string, data: CommentData): Promise<Comment> {
        return CommentClient.updateComment(id, data)
    }
    async deleteComment(id: string): Promise<Comment> {
        return CommentClient.deleteComment(id)
    }
}

export const CommentManager = new CommentManagerImpl()