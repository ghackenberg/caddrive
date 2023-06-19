import axios from 'axios'

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'

import { auth } from '../auth'

class IssueClientImpl implements IssueREST {
    async findIssues(product: string, milestone?: string, state?: string, tags?: string[]): Promise<Issue[]> {
        return (await axios.get<Issue[]>(`/rest/issues`, { params: { product, milestone, state, tags }, ...auth })).data
    }
    async addIssue(data: IssueAddData): Promise<Issue> {
        return (await axios.post<Issue>('/rest/issues', data, { ...auth })).data
    }
    async getIssue(id: string): Promise<Issue> {
        return (await axios.get<Issue>(`/rest/issues/${id}`, { ...auth })).data
    }
    async updateIssue(id: string, data: IssueUpdateData): Promise<Issue> {

        return (await axios.put<Issue>(`/rest/issues/${id}`, data, { ...auth })).data
    }
    async deleteIssue(id: string): Promise<Issue> {
        return (await axios.delete<Issue>(`/rest/issues/${id}`, { ...auth })).data
    }
}

export const IssueClient = new IssueClientImpl()