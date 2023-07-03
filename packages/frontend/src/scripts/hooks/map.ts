import * as React from 'react'

import { Comment, Issue } from 'productboard-common'

import { useIssues } from './list'
import { CacheAPI } from '../clients/cache'
import { MqttAPI } from '../clients/mqtt'

function recompute(issues: Issue[]) {
    const value: {[issueId: string]: Comment[]} = {}
    for (const issue of issues || []) {
        value[issue.issueId] = CacheAPI.getComments(issue.productId, issue.issueId)
    }
    return value
}

export function useIssuesComments(productId: string, milestoneId?: string) {

    const issues = useIssues(productId, milestoneId)

    const initialIssuesComments: {[issueId: string]: Comment[]} = recompute(issues)

    const [issuesComments, setIssuesComments] = React.useState(initialIssuesComments)

    React.useEffect(() => {
        let exec = true
        for (const issue of issues || []) {
            if (!(issue.issueId in issuesComments)) {
                CacheAPI.loadComments(productId, issue.issueId).then(() => exec && setIssuesComments(recompute(issues)))
            }
        }
        return () => { exec = false }
    }, [issues])

    React.useEffect(() => {
        const callbacks: (() => void)[] = []
        for (const issue of issues || []) {
            callbacks.push(MqttAPI.subscribeComments(productId, issue.issueId, () => setIssuesComments(recompute(issues))))
        }
        return () => {
            for (const callback of callbacks) {
                callback()
            }
        }
    }, [issues])

    return issuesComments
}