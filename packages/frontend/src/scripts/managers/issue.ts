import { Issue, IssueAddData, IssueUpdateData } from 'productboard-common'

import { IssueClient } from '../clients/rest/issue'
import { AbstractManager } from './abstract'

class IssueManagerImpl extends AbstractManager<Issue> {
    // CACHE
    
    findIssuesFromCache(productId: string, milestoneId?: string, state?: string, tagId?: string) {
        return this.getFind(`${productId}-${milestoneId}-${state}-${tagId}`)
    }
    getIssueFromCache(issueId: string) { 
        return this.getItem(issueId)
    }

    // REST

    findIssues(productId: string, milestoneId: string, state: string, tagId: string, callback: (issues: Issue[], error?: string) => void) {
        return this.find(
            `${productId}-${milestoneId}-${state}-${tagId}`,
            () => IssueClient.findIssues(productId, milestoneId, state, tagId),
            issue => (!productId || issue.productId == productId) && (!milestoneId || issue.milestoneId == milestoneId) && (!state || issue.state == state) && !tagId,
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