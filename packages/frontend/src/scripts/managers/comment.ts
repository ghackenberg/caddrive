import { Comment, CommentAddData, CommentUpdateData, CommentREST } from 'productboard-common'

import { CommentClient } from '../clients/rest/comment'
import { AbstractManager } from './abstract'

class CommentManagerImpl extends AbstractManager<Comment> implements CommentREST<CommentAddData, CommentUpdateData, Blob> {
    // CACHE
    
    findCommentsFromCache(issueId: string) { 
        return this.getFind(issueId)
    }

    // REST
    
    async findComments(issueId: string) {
        return this.find(
            issueId,
            () => CommentClient.findComments(issueId),
            comment => comment.issueId == issueId
        )
    }
    async addComment(data: CommentAddData, files: { audio?: Blob }) {
        return this.add(CommentClient.addComment(data, files))
    }
    async getComment(id: string) {
        return this.get(id, () => CommentClient.getComment(id))
    }
    async updateComment(id: string, data: CommentUpdateData, files?: { audio?: Blob }) {
        return this.delete(id, CommentClient.updateComment(id, data, files))
    }
    async deleteComment(id: string) {
        return this.delete(id, CommentClient.deleteComment(id))
    }
}

export const CommentManager = new CommentManagerImpl()