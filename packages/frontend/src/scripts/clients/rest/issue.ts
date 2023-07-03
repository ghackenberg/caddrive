import axios from 'axios'

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'

import { auth } from '../auth'
import { MqttAPI } from '../mqtt'

class IssueClientImpl implements IssueREST<IssueAddData, IssueUpdateData, Blob> {
    async findIssues(productId: string): Promise<Issue[]> {
        return (await axios.get<Issue[]>(`/rest/products/${productId}/issues`, auth)).data
    }
    async addIssue(productId: string, data: IssueAddData, files: { audio?: Blob }): Promise<Issue> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files.audio) {
            body.append('audio', files.audio)
        }
        const issue = (await axios.post<Issue>(`/rest/products/${productId}/issues`, body, auth)).data
        MqttAPI.publishIssueLocal(issue)
        return issue
    }
    async getIssue(productId: string, issueId: string): Promise<Issue> {
        return (await axios.get<Issue>(`/rest/products/${productId}/issues/${issueId}`, { ...auth })).data
    }
    async updateIssue(productId: string, issueId: string, data: IssueUpdateData, files?: { audio?: Blob }): Promise<Issue> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files) {
            if (files.audio) {
                body.append('audio', files.audio)
            }
        }
        const issue = (await axios.put<Issue>(`/rest/products/${productId}/issues/${issueId}`, body, auth)).data
        MqttAPI.publishIssueLocal(issue)
        return issue
    }
    async deleteIssue(productId: string, issueId: string): Promise<Issue> {
        const issue = (await axios.delete<Issue>(`/rest/products/${productId}/issues/${issueId}`, auth)).data
        MqttAPI.publishIssueLocal(issue)
        return issue
    }
}

export const IssueClient = new IssueClientImpl()