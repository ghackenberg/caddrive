import { Issue, IssueAddData, IssueUpdateData } from 'productboard-common'

import { AbstractManager } from './abstract'
import { IssueClient } from '../clients/rest/issue'

class IssueManagerImpl extends AbstractManager<Issue> {
    // CACHE
    
    findIssuesFromCache(productId: string, milestoneId?: string, state?: string) {
        return this.getFind(`${productId}-${milestoneId}-${state}`)
    }
    getIssueFromCache(issueId: string) { 
        return this.getItem(issueId)
    }

    // REST

    findIssues(productId: string, milestoneId: string, state: string, callback: (issues: Issue[], error?: string) => void) {
        return this.find(
            `${productId}-${milestoneId}-${state}`,
            () => IssueClient.findIssues(productId, milestoneId, state),
            issue => (!productId || issue.productId == productId) && (!milestoneId || issue.milestoneId == milestoneId) && (!state || issue.state == state),
            (a, b) => a.created - b.created,
            callback
        )
    }
    async addIssue(data: IssueAddData, files: { audio?: Blob }) {
        return this.resolveItem(await IssueClient.addIssue(data, files))
    }
    getIssue(id: string, callback: (issue: Issue, error?: string) => void) {
        return this.observeItem(id, () => IssueClient.getIssue(id), callback)
    }
    async updateIssue(id: string, data: IssueUpdateData, files?: { audio?: Blob }) {
        return this.promiseItem(id, IssueClient.updateIssue(id, data, files))
    }
    async deleteIssue(id: string) {
        return this.promiseItem(id, IssueClient.deleteIssue(id))
    }
}

export const IssueManager = new IssueManagerImpl('issue')