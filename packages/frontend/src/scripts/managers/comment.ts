import { Comment, CommentAddData, CommentUpdateData } from 'productboard-common'

import { AbstractManager } from './abstract'
import { CommentClient } from '../clients/rest/comment'

class CommentManagerImpl extends AbstractManager<Comment> {
    // CACHE
    
    findCommentsFromCache(issueId: string) { 
        return this.getFind(issueId)
    }
    getCommentFromCache(commentId: string) { 
        return this.getItem(commentId)
    }

    // REST
    
    findComments(issueId: string, callback: (comments: Comment[], error?: string) => void) {
        return this.find(
            issueId,
            () => CommentClient.findComments(issueId),
            comment => comment.issueId == issueId,
            (a, b) => a.created - b.created,
            callback
        )
    }
    async addComment(data: CommentAddData, files: { audio?: Blob }) {
        return this.resolveItem(await CommentClient.addComment(data, files))
    }
    getComment(id: string, callback: (comment: Comment, error?: string) => void) {
        return this.observeItem(id, () => CommentClient.getComment(id), callback)
    }
    async updateComment(id: string, data: CommentUpdateData, files?: { audio?: Blob }) {
        return this.promiseItem(id, CommentClient.updateComment(id, data, files))
    }
    async deleteComment(id: string) {
        return this.promiseItem(id, CommentClient.deleteComment(id))
    }
}

export const CommentManager = new CommentManagerImpl('comment')