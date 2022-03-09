import { Issue, IssueData, IssueREST } from 'productboard-common'
import { IssueClient } from '../clients/rest/issue'

class IssueManagerImpl implements IssueREST {
    private issueIndex: {[id: string]: Issue} = {}
    private productIndex: {[id: string]: {[id: string]: boolean}} = {}

    async findIssues(productId: string): Promise<Issue[]> {
        if (!(productId in this.productIndex)) {
            // Call backend
            const issues = await IssueClient.findIssues(productId)
            // Update issue index
            for (const issue of issues) {
                this.issueIndex[issue.id] = issue
            }
            // Update product index
            this.productIndex[productId] = {}
            for (const issue of issues) {
                this.productIndex[productId][issue.id] = true
            }
        }
        // Return issues
        return Object.keys(this.productIndex[productId]).map(id => this.issueIndex[id])
    }

    async addIssue(data: IssueData): Promise<Issue> {
        // Call backend
        const issue = await IssueClient.addIssue(data)
        // Update issue index
        this.issueIndex[issue.id] = issue
        // Update product index
        if (issue.productId in this.productIndex) {
            this.productIndex[issue.productId][issue.id] = true
        }
        // Return issue
        return issue
    }

    async getIssue(id: string): Promise<Issue> {
        if (!(id in this.issueIndex)) {
            // Call backend
            const issue = await IssueClient.getIssue(id)
            // Update issue index
            this.issueIndex[issue.id] = issue
            // Update product index
            if (issue.productId in this.productIndex) {
                this.productIndex[issue.productId][id] = true
            }
        }
        // Return issue
        return this.issueIndex[id]
    }

    async updateIssue(id: string, data: IssueData): Promise<Issue> {
        if (id in this.issueIndex) {
            const issue = this.issueIndex[id]
            // Update product index
            if (issue.productId in this.productIndex) {
                delete this.productIndex[issue.productId][id]
            }
        }
        // Call backend
        const issue = await IssueClient.updateIssue(id, data)
        // Update issue index
        this.issueIndex[issue.id] = issue
        // Update product index
        if (issue.productId in this.productIndex) {
            this.productIndex[issue.productId][id] = true
        }
        // Return issue
        return issue
    }

    async deleteIssue(id: string): Promise<Issue> {
        // Call backend
        const issue = await IssueClient.deleteIssue(id)
        // Update issue index
        this.issueIndex[issue.id] = issue
        // Update product index
        if (issue.productId in this.productIndex) {
            delete this.productIndex[issue.productId][id]
        }
        // Return issue
        return issue
    }
}

export const IssueManager = new IssueManagerImpl()