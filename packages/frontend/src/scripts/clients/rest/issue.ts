import axios from 'axios'
// Commons
import { Issue, IssueData, IssueREST } from 'productboard-common'
// Globals
import { auth } from '../auth'

class IssueClient implements IssueREST {
    async findIssues(product: string): Promise<Issue[]> {
        return (await axios.get<Issue[]>(`/rest/issues`, { params: { product }, auth })).data
    }
    async addIssue(data: IssueData): Promise<Issue> {
        return (await axios.post<Issue>('/rest/issues', data, { auth })).data
    }
    async getIssue(id: string): Promise<Issue> {
        return (await axios.get<Issue>(`/rest/issues/${id}`, { auth })).data
    }
    async updateIssue(id: string, data: IssueData): Promise<Issue> {
        return (await axios.put<Issue>(`/rest/issues/${id}`, data, { auth })).data
    }
    async deleteIssue(id: string): Promise<Issue> {
        return (await axios.delete<Issue>(`/rest/issues/${id}`, { auth })).data
    }
}

export const IssueAPI = new IssueClient()