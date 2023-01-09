import axios from 'axios'

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'

import { auth } from '../auth'

class IssueClientImpl implements IssueREST<IssueAddData, IssueUpdateData, Blob> {
    async findIssues(product: string, milestone?: string, state?: string): Promise<Issue[]> {
        return (await axios.get<Issue[]>(`/rest/issues`, { params: { product, milestone, state }, ...auth })).data
    }
    async addIssue(data: IssueAddData, files: { audio?: Blob }): Promise<Issue> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files.audio) {
            body.append('audio', files.audio)
        }
        return (await axios.post<Issue>('/rest/issues', body, { ...auth })).data
    }
    async getIssue(id: string): Promise<Issue> {
        return (await axios.get<Issue>(`/rest/issues/${id}`, { ...auth })).data
    }
    async updateIssue(id: string, data: IssueUpdateData, files?: { audio?: Blob }): Promise<Issue> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files) {
            if (files.audio) {
                body.append('audio', files.audio)
            }
        }
        return (await axios.put<Issue>(`/rest/issues/${id}`, body, { ...auth })).data
    }
    async deleteIssue(id: string): Promise<Issue> {
        return (await axios.delete<Issue>(`/rest/issues/${id}`, { ...auth })).data
    }
}

export const IssueClient = new IssueClientImpl()