import { Issue, IssueAddData, IssueUpdateData } from 'productboard-common'

import { IssueClient } from '../clients/rest/issue'
import { AbstractManager } from './abstract'

class IssueManagerImpl extends AbstractManager<Issue> {
    // CACHE
    
    findIssuesFromCache(productId: string, milestoneId?: string, state?: string, tagIds?: string[]) {
        return this.getFind(`${productId}-${milestoneId}-${state}-${tagIds}`)
    }
    getIssueFromCache(issueId: string) { 
        return this.getItem(issueId)
    }

    // REST

    findIssues(productId: string, milestoneId: string, state: string, tagIds: string[], callback: (issues: Issue[], error?: string) => void) {
        return this.find(
            //TODO: fix tagIds for caching
            `${productId}-${milestoneId}-${state}-${tagIds}`,
            () => IssueClient.findIssues(productId, milestoneId, state, tagIds),
            issue => (!productId || issue.productId == productId) && (!milestoneId || issue.milestoneId == milestoneId) && (!state || issue.state == state) && !tagIds,
            (a, b) => a.created - b.created,
            callback
        )
    }
    async addIssue(data: IssueAddData) {
        return this.resolveItem(await IssueClient.addIssue(data))
    }
    getIssue(id: string, callback: (issue: Issue, error?: string) => void) {
        return this.observeItem(id, () => IssueClient.getIssue(id), callback)
    }
    async updateIssue(id: string, data: IssueUpdateData) {
        return this.promiseItem(id, IssueClient.updateIssue(id, data))
    }
    async deleteIssue(id: string) {
        return this.promiseItem(id, IssueClient.deleteIssue(id))
    }
}

export const IssueManager = new IssueManagerImpl('issue')