import { Comment, CommentAddData, CommentUpdateData, CommentREST, CommentDownMQTT } from 'productboard-common'

import { CommentAPI } from '../clients/mqtt/comment'
import { CommentClient } from '../clients/rest/comment'
import { AbstractManager } from './abstract'

class CommentManagerImpl extends AbstractManager<Comment> implements CommentREST<CommentAddData, CommentUpdateData, Blob>, CommentDownMQTT {
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}

    constructor() {
        super()
        CommentAPI.register(this)
    }

    // CACHE

    findCommentsFromCache(issueId: string) { 
        const key = `${issueId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.load(id))
        } else { 
            return undefined 
        } 
    }

    private addToFindIndex(comment: Comment) {
        if (`${comment.issueId}` in this.findIndex) {
            this.findIndex[`${comment.issueId}`][comment.id] = true
        }
    }
    private removeFromFindIndex(comment: Comment) { 
        for (const key of Object.keys(this.findIndex)) {
            if (comment.id in this.findIndex[key]) {
                delete this.findIndex[key][comment.id]
            }
        }

    }

    // MQTT

    create(comment: Comment): void {
        comment = this.store(comment)
        this.addToFindIndex(comment)
    }
    update(comment: Comment): void {
        comment = this.store(comment)
        this.removeFromFindIndex(comment)
        this.addToFindIndex(comment)
    }
    delete(comment: Comment): void {
        comment = this.store(comment)
        this.removeFromFindIndex(comment)
    }

    // REST
    
    async findComments(issueId: string): Promise<Comment[]> {
        const key = `${issueId}`
        if (!(key in this.findIndex)) {
            // Call backend
            let comments = await CommentClient.findComments(issueId)
            // Upate comment index
            comments = comments.map(comment => this.store(comment))
            // Init find index
            this.findIndex[key] = {}
            // Update finx index
            comments.forEach(comment => this.addToFindIndex(comment))
        }
        // Return comments
        return Object.keys(this.findIndex[key]).map(id => this.load(id)).filter(comment => !comment.deleted)
    }

    async addComment(data: CommentAddData, files: { audio?: Blob }): Promise<Comment> {
        // Call backend
        let comment = await CommentClient.addComment(data, files)
        // Update comment index
        comment = this.store(comment)
        // Update find index
        this.addToFindIndex(comment)
        // Return comment
        return this.load(comment.id)
    }

    async getComment(id: string): Promise<Comment> {
        if (!this.has(id)) {
            // Call backend
            let comment = await CommentClient.getComment(id)
            // Update comment index
            comment = this.store(comment)
            // Update find index
            this.addToFindIndex(comment)
        }
        // Return comment
        return this.load(id)
    }

    async updateComment(id: string, data: CommentUpdateData, files?: { audio?: Blob }): Promise<Comment> {
        // Call backend
        let comment = await CommentClient.updateComment(id, data, files)
        // Update comment index
        comment = this.store(comment)
        // Update find index
        this.removeFromFindIndex(comment)
        this.addToFindIndex(comment)
        // Return comment
        return this.load(id)
    }

    async deleteComment(id: string): Promise<Comment> {
        // Call backend
        let comment = await CommentClient.deleteComment(id)
        // Update comment index
        comment = this.store(comment)
        // Update issue index
        this.removeFromFindIndex(comment)
        // Return comment
        return this.load(id)
    }
}

export const CommentManager = new CommentManagerImpl()