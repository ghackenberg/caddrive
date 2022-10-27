import { Comment, CommentAddData, CommentUpdateData, CommentREST } from 'productboard-common'
import { CommentClient } from '../clients/rest/comment'

class CommentManagerImpl implements CommentREST<CommentAddData, CommentUpdateData, Blob> {
    private commentIndex: {[id: string]: Comment} = {}
    private issueIndex: {[id: string]: {[id: string]: boolean}} = {}
    
    async findComments(issueId: string): Promise<Comment[]> {
        if (!(issueId in this.issueIndex)) {
            // Call backend
            const comments = await CommentClient.findComments(issueId)
            // Upate comment index
            for (const comment of comments) {
                this.commentIndex[comment.id] = comment
            }
            // Update issue index
            this.issueIndex[issueId] = {}
            for (const comment of comments) {
                this.issueIndex[issueId][comment.id] = true
            }
        }
        // Return comments
        return Object.keys(this.issueIndex[issueId]).map(id => this.commentIndex[id])
    }

    async addComment(data: CommentAddData, files: { audio?: Blob }): Promise<Comment> {
        // Call backend
        const comment = await CommentClient.addComment(data, files)
        // Update comment index
        this.commentIndex[comment.id] = comment
        // Update issue index
        if (comment.issueId in this.issueIndex) {
            this.issueIndex[comment.issueId][comment.id] = true
        }
        // Return comment
        return comment
    }

    async getComment(id: string): Promise<Comment> {
        if (!(id in this.commentIndex)) {
            // Call backend
            const comment = await CommentClient.getComment(id)
            // Update comment index
            this.commentIndex[id] = comment
            // Update issue index
            if (comment.issueId in this.issueIndex) {
                this.issueIndex[comment.issueId][id] = true
            }
        }
        // Return comment
        return this.commentIndex[id]
    }

    async updateComment(id: string, data: CommentUpdateData, files?: { audio?: Blob }): Promise<Comment> {
        if (id in this.commentIndex) {
            const comment = this.commentIndex[id]
            // Update issue index
            if (comment.issueId in this.issueIndex) {
                delete this.issueIndex[comment.issueId][id]
            }
        }
        // Call backend
        const comment = await CommentClient.updateComment(id, data, files)
        // Update comment index
        this.commentIndex[id] = comment
        // Update issue index
        if (comment.issueId in this.issueIndex) {
            this.issueIndex[comment.issueId][id] = true
        }
        // Return comment
        return comment
    }

    async deleteComment(id: string): Promise<Comment> {
        // Call backend
        const comment = await CommentClient.deleteComment(id)
        // Update comment index
        this.commentIndex[id] = comment
        // Update issue index
        if (comment.issueId in this.issueIndex) {
            delete this.issueIndex[comment.issueId][id]
        }
        // Return comment
        return comment
    }
}

export const CommentManager = new CommentManagerImpl()