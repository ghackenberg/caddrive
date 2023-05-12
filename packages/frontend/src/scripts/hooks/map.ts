import * as React from 'react'

import { Comment } from 'productboard-common'

import { CommentManager } from '../managers/comment'
import { useIssues } from './list'

export function useIssuesComments(productId: string, milestoneId?: string) {

    function compare(a: Comment, b: Comment) {
        return a.created - b.created
    }

    const issues = useIssues(productId, milestoneId)

    const initialIssuesComments: {[issueId: string]: Comment[]} = {}
    for (const issue of issues || []) {
        const value = CommentManager.findCommentsFromCache(issue.id)
        initialIssuesComments[issue.id] = value && value.sort(compare)
    }

    const [issuesComments, setIssuesComments] = React.useState(initialIssuesComments)

    React.useEffect(() => {
        const callbacks: (() => void)[] = []
        if (issues) {
            const issuesComments: {[issueId: string]: Comment[]} = {}
            for (const issue of issues) {
                callbacks.push(CommentManager.findComments(issue.id, (comments, error) => {
                    if (error) {
                        // At least one promise rejected
                        setIssuesComments(undefined)
                    } else {
                        // At least one promise resolved
                        issuesComments[issue.id] = comments
                        // Did all promises resolve?
                        if (Object.keys(issuesComments).length == issues.length) {
                            setIssuesComments(issuesComments)
                        }
                    }
                }))
            }
        }
        return () => {
            for (const callback of callbacks) {
                callback()
            }
        }
    }, [issues])

    return issuesComments
}