import * as React from 'react'

import { CommentRead, IssueRead } from 'productboard-common'

import { useIssues } from './list'
import { CacheAPI } from '../clients/cache'

type Unsubscribe = () => void

function recompute(issues: IssueRead[]) {
    const value: {[issueId: string]: CommentRead[]} = {}
    for (const issue of issues || []) {
        value[issue.issueId] = CacheAPI.getComments(issue.productId, issue.issueId)
    }
    return value
}

export function useIssuesComments(productId: string, milestoneId?: string) {
    const issues = useIssues(productId, milestoneId)

    const initialIssuesComments: {[issueId: string]: CommentRead[]} = recompute(issues)

    const [issuesComments, setIssuesComments] = React.useState(initialIssuesComments)

    React.useEffect(() => {
        const unsubscribes: Unsubscribe[] = []
        for (const issue of issues || []) {
            const unsubscribe = CacheAPI.subscribeComments(productId, issue.issueId, () => {
                setIssuesComments(recompute(issues))
            })
            unsubscribes.push(unsubscribe)
        }
        return () => {
            for (const unsubscribe of unsubscribes) {
                unsubscribe()
            }
        }
    }, [issues])

    return issuesComments
}