import { Issue, IssueAddData, IssueUpdateData, IssueREST, IssueDownMQTT } from 'productboard-common'

import { IssueAPI } from '../clients/mqtt/issue'
import { IssueClient } from '../clients/rest/issue'
import { AbstractManager } from './abstract'

class IssueManagerImpl extends AbstractManager<Issue> implements IssueREST<IssueAddData, IssueUpdateData, Blob>, IssueDownMQTT {
    private findIndex: {[key: string]: {[issueId: string]: boolean}} = {}

    constructor() {
        super()
        IssueAPI.register(this)
    }

    // CACHE

    override clear() {
        super.clear()
        this.findIndex = {}
    }
    
    findIssuesFromCache(productId: string, milestoneId?: string, state?: string) {
        const key = `${productId}-${milestoneId}-${state}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.getResolveItem(id))
        } else { 
            return undefined 
        } 
    }
    getIssueFromCache(issueId: string) { 
        return this.getResolveItem(issueId)
    }

    private addToFindIndex(issue: Issue) {
        if (`${issue.productId}-${undefined}-${undefined}` in this.findIndex) {
            this.findIndex[`${issue.productId}-${undefined}-${undefined}`][issue.id] = true
        }
        if (`${issue.productId}-${issue.milestoneId}-${undefined}` in this.findIndex) {
            this.findIndex[`${issue.productId}-${issue.milestoneId}-${undefined}`][issue.id] = true
        }
        if (`${issue.productId}-${undefined}-${issue.state}` in this.findIndex) {
            this.findIndex[`${issue.productId}-${undefined}-${issue.state}`][issue.id] = true
        }
        if (`${issue.productId}-${issue.milestoneId}-${issue.state}` in this.findIndex) {
            this.findIndex[`${issue.productId}-${issue.milestoneId}-${issue.state}`][issue.id] = true
        }
    }
    private removeFromFindIndex(issue: Issue) { 	
        for (const key of Object.keys(this.findIndex)) {
            if (issue.id in this.findIndex[key]) {
                delete this.findIndex[key][issue.id]
            }
        }
    }

    // MQTT

    create(issue: Issue): void {
        issue = this.resolveItem(issue)
        this.addToFindIndex(issue)
    }
    update(issue: Issue): void {
        issue = this.resolveItem(issue)
        this.removeFromFindIndex(issue)
        this.addToFindIndex(issue)
    }
    delete(issue: Issue): void {
        issue = this.resolveItem(issue)
        this.removeFromFindIndex(issue)
    }

    // REST

    async findIssues(productId: string, milestoneId?: string, state?: string): Promise<Issue[]> {
        const key = `${productId}-${milestoneId}-${state}`
        if (!(key in this.findIndex)) {
            // Call backend
            let issues = await IssueClient.findIssues(productId, milestoneId, state)
            // Update issue index
            issues = issues.map(issue => this.resolveItem(issue))
            // Init find index
            this.findIndex[key] = {}
            // Update find index
            issues.forEach(issue => this.addToFindIndex(issue))
        }
        // Return issues
        return Object.keys(this.findIndex[key]).map(id => this.getResolveItem(id)).filter(issue => !issue.deleted)
    }

    async addIssue(data: IssueAddData, files: { audio?: Blob }): Promise<Issue> {
        // Call backend
        let issue = await IssueClient.addIssue(data, files)
        // Update issue index
        issue = this.resolveItem(issue)
        // Update find index
        this.addToFindIndex(issue)
        // Return issue
        return this.getResolveItem(issue.id)
    }

    async getIssue(id: string): Promise<Issue> {
        if (!this.hasResolveItem(id)) {
            // Call backend
            let issue = await IssueClient.getIssue(id)
            // Update issue index
            issue = this.resolveItem(issue)
            // Update find index
            this.addToFindIndex(issue)
        }
        // Return issue
        return this.getResolveItem(id)
    }

    async updateIssue(id: string, data: IssueUpdateData, files?: { audio?: Blob }): Promise<Issue> {
        // Call backend
        let issue = await IssueClient.updateIssue(id, data, files)
        // Update issue index
        issue = this.resolveItem(issue)
        // Update find index
        this.removeFromFindIndex(issue)
        this.addToFindIndex(issue)
        // Return issue
        return this.getResolveItem(id)
    }

    async deleteIssue(id: string): Promise<Issue> {
        // Call backend
        let issue = await IssueClient.deleteIssue(id)
        // Update issue index
        issue = this.resolveItem(issue)
        // Update find index
        this.removeFromFindIndex(issue)
        // Return issue
        return this.getResolveItem(id)
    }
}

export const IssueManager = new IssueManagerImpl()