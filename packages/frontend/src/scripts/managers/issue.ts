import { Issue, IssueData, IssueREST } from 'productboard-common'
import { IssueAPI } from '../clients/rest/issue'

class IssueManagerImpl implements IssueREST {
    async findIssues(productId: string): Promise<Issue[]> {
        return IssueAPI.findIssues(productId)
    }
    async addIssue(data: IssueData): Promise<Issue> {
        return IssueAPI.addIssue(data)
    }
    async getIssue(id: string): Promise<Issue> {
        return IssueAPI.getIssue(id)
    }
    async updateIssue(id: string, data: IssueData): Promise<Issue> {
        return IssueAPI.updateIssue(id, data)
    }
    async deleteIssue(id: string): Promise<Issue> {
        return IssueAPI.deleteIssue(id)
    }
}

export const IssueManager = new IssueManagerImpl()