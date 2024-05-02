import axios from 'axios'

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class IssueClientImpl implements IssueREST {
    async findIssues(productId: string): Promise<Issue[]> {
        return (await axios.get<Issue[]>(`/rest/products/${productId}/issues`, auth)).data
    }
    async addIssue(productId: string, data: IssueAddData): Promise<Issue> {
        const issue = (await axios.post<Issue>(`/rest/products/${productId}/issues`, data, auth)).data
        CacheAPI.putIssue(issue)
        return issue
    }
    async getIssue(productId: string, issueId: string): Promise<Issue> {
        return (await axios.get<Issue>(`/rest/products/${productId}/issues/${issueId}`, { ...auth })).data
    }
    async updateIssue(productId: string, issueId: string, data: IssueUpdateData): Promise<Issue> {
        const issue = (await axios.put<Issue>(`/rest/products/${productId}/issues/${issueId}`, data, auth)).data
        CacheAPI.putIssue(issue)
        return issue
    }
    async deleteIssue(productId: string, issueId: string): Promise<Issue> {
        const issue = (await axios.delete<Issue>(`/rest/products/${productId}/issues/${issueId}`, auth)).data
        CacheAPI.putIssue(issue)
        return issue
    }
}

export const IssueClient = new IssueClientImpl()