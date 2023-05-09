import { Comment, CommentAddData, CommentUpdateData } from 'productboard-common'

import { CommentClient } from '../clients/rest/comment'
import { AbstractManager } from './abstract'

class CommentManagerImpl extends AbstractManager<Comment> {
    // CACHE
    
    findCommentsFromCache(issueId: string) { 
        return this.getFind(issueId)
    }

    // REST
    
    findComments(issueId: string, callback: (comments: Comment[], error?: string) => void) {
        return this.find(
            issueId,
            () => CommentClient.findComments(issueId),
            comment => comment.issueId == issueId,
            callback
        )
    }
    async addComment(data: CommentAddData, files: { audio?: Blob }) {
        return this.add(CommentClient.addComment(data, files))
    }
    getComment(id: string, callback: (comment: Comment, error?: string) => void) {
        return this.get(id, () => CommentClient.getComment(id), callback)
    }
    async updateComment(id: string, data: CommentUpdateData, files?: { audio?: Blob }) {
        return this.delete(id, CommentClient.updateComment(id, data, files))
    }
    async deleteComment(id: string) {
        return this.delete(id, CommentClient.deleteComment(id))
    }
}

export const CommentManager = new CommentManagerImpl()