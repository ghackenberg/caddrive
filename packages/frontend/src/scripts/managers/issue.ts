import { Issue, IssueData, IssueREST } from 'productboard-common'
import { IssueClient } from '../clients/rest/issue'

class IssueManagerImpl implements IssueREST {
    async findIssues(productId: string): Promise<Issue[]> {
        return IssueClient.findIssues(productId)
    }
    async addIssue(data: IssueData): Promise<Issue> {
        return IssueClient.addIssue(data)
    }
    async getIssue(id: string): Promise<Issue> {
        return IssueClient.getIssue(id)
    }
    async updateIssue(id: string, data: IssueData): Promise<Issue> {
        return IssueClient.updateIssue(id, data)
    }
    async deleteIssue(id: string): Promise<Issue> {
        return IssueClient.deleteIssue(id)
    }
}

export const IssueManager = new IssueManagerImpl()