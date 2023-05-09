import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'

import { IssueClient } from '../clients/rest/issue'
import { AbstractManager } from './abstract'

class IssueManagerImpl extends AbstractManager<Issue> implements IssueREST<IssueAddData, IssueUpdateData, Blob> {
    // CACHE
    
    findIssuesFromCache(productId: string, milestoneId?: string, state?: string) {
        return this.getFind(`${productId}-${milestoneId}-${state}`)
    }
    getIssueFromCache(issueId: string) { 
        return this.getItem(issueId)
    }

    // REST

    async findIssues(productId: string, milestoneId?: string, state?: string) {
        return this.find(
            `${productId}-${milestoneId}-${state}`,
            () => IssueClient.findIssues(productId, milestoneId, state),
            issue => (!productId || issue.productId == productId) && (!milestoneId || issue.milestoneId == milestoneId) && (!state || issue.state == state)
        )
    }
    async addIssue(data: IssueAddData, files: { audio?: Blob }) {
        return this.add(IssueClient.addIssue(data, files))
    }
    async getIssue(id: string) {
        return this.get(id, () => IssueClient.getIssue(id))
    }
    async updateIssue(id: string, data: IssueUpdateData, files?: { audio?: Blob }) {
        return this.update(id, IssueClient.updateIssue(id, data, files))
    }
    async deleteIssue(id: string) {
        return this.delete(id, IssueClient.deleteIssue(id))
    }
}

export const IssueManager = new IssueManagerImpl()