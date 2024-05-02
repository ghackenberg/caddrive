import axios from 'axios'

import { IssueCreate, IssueREST, IssueRead, IssueUpdate } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class IssueClientImpl implements IssueREST {
    async findIssues(productId: string): Promise<IssueRead[]> {
        return (await axios.get<IssueRead[]>(`/rest/products/${productId}/issues`, auth)).data
    }
    async addIssue(productId: string, data: IssueCreate): Promise<IssueRead> {
        const issue = (await axios.post<IssueRead>(`/rest/products/${productId}/issues`, data, auth)).data
        CacheAPI.putIssue(issue)
        return issue
    }
    async getIssue(productId: string, issueId: string): Promise<IssueRead> {
        return (await axios.get<IssueRead>(`/rest/products/${productId}/issues/${issueId}`, { ...auth })).data
    }
    async updateIssue(productId: string, issueId: string, data: IssueUpdate): Promise<IssueRead> {
        const issue = (await axios.put<IssueRead>(`/rest/products/${productId}/issues/${issueId}`, data, auth)).data
        CacheAPI.putIssue(issue)
        return issue
    }
    async deleteIssue(productId: string, issueId: string): Promise<IssueRead> {
        const issue = (await axios.delete<IssueRead>(`/rest/products/${productId}/issues/${issueId}`, auth)).data
        CacheAPI.putIssue(issue)
        return issue
    }
}

export const IssueClient = new IssueClientImpl()