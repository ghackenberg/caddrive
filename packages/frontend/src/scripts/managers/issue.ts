import { Issue, IssueAddData, IssueUpdateData, IssueREST, IssueDownMQTT } from 'productboard-common'

import { IssueAPI } from '../clients/mqtt/issue'
import { IssueClient } from '../clients/rest/issue'

class IssueManagerImpl implements IssueREST<IssueAddData, IssueUpdateData, Blob>, IssueDownMQTT {
    private issueIndex: {[issueId: string]: Issue} = {}
    private findIndex: {[key: string]: {[issueId: string]: boolean}} = {}

    constructor() {
        IssueAPI.register(this)
    }

    // CACHE
    
    findIssuesFromCache(productId: string, milestoneId?: string, state?: string) {
        const key = `${productId}-${milestoneId}-${state}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.issueIndex[id])
        } else { 
            return undefined 
        } 
    }
    getIssueFromCache(issueId: string) { 
        if (issueId in this.issueIndex) { 
            return this.issueIndex[issueId]
        } else { 
            return undefined 
        } 
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
        this.issueIndex[issue.id] = issue
        this.addToFindIndex(issue)
    }
    update(issue: Issue): void {
        this.issueIndex[issue.id] = issue
        this.removeFromFindIndex(issue)
        this.addToFindIndex(issue)
    }
    delete(issue: Issue): void {
        this.issueIndex[issue.id] = issue
        this.removeFromFindIndex(issue)
    }

    // REST

    async findIssues(productId: string, milestoneId?: string, state?: string): Promise<Issue[]> {
        const key = `${productId}-${milestoneId}-${state}`
        if (!(key in this.findIndex)) {
            // Call backend
            const issues = await IssueClient.findIssues(productId, milestoneId, state)
            // Update issue index
            for (const issue of issues) {
                this.issueIndex[issue.id] = issue
            }
            // Update find index
            this.findIndex[key] = {}
            for (const issue of issues) {
                this.findIndex[key][issue.id] = true
            }
        }
        // Return issues
        return Object.keys(this.findIndex[key]).map(id => this.issueIndex[id])
    }

    async addIssue(data: IssueAddData, files: { audio?: Blob }): Promise<Issue> {
        // Call backend
        const issue = await IssueClient.addIssue(data, files)
        // Update issue index
        this.issueIndex[issue.id] = issue
        // Update find index
        this.addToFindIndex(issue)
        // Return issue
        return issue
    }

    async getIssue(id: string): Promise<Issue> {
        if (!(id in this.issueIndex)) {
            // Call backend
            const issue = await IssueClient.getIssue(id)
            // Update issue index
            this.issueIndex[issue.id] = issue
        }
        // Return issue
        return this.issueIndex[id]
    }

    async updateIssue(id: string, data: IssueUpdateData, files?: { audio?: Blob }): Promise<Issue> {
        // Call backend
        const issue = await IssueClient.updateIssue(id, data, files)
        // Update issue index
        this.issueIndex[issue.id] = issue
        // Update find index
        this.removeFromFindIndex(issue)
        this.addToFindIndex(issue)
        // Return issue
        return issue
    }

    async deleteIssue(id: string): Promise<Issue> {
        // Call backend
        const issue = await IssueClient.deleteIssue(id)
        // Update issue index
        this.issueIndex[issue.id] = issue
        // Update find index
        this.removeFromFindIndex(issue)
        // Return issue
        return issue
    }
}

export const IssueManager = new IssueManagerImpl()