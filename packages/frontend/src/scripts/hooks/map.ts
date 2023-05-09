import * as React from 'react'

import { Comment } from 'productboard-common'

import { CommentManager } from '../managers/comment'
import { useIssues } from './list'

export function useIssuesComments(productId: string, milestoneId?: string) {

    function compare(a: Comment, b: Comment) {
        return a.created - b.created
    }

    const issues = useIssues(productId, milestoneId)

    const initialComments: {[issueId: string]: Comment[]} = {}
    for (const issue of issues || []) {
        const value = CommentManager.findCommentsFromCache(issue.id)
        initialComments[issue.id] = value && value.sort(compare)
    }

    const [comments, setComments] = React.useState(initialComments)

    React.useEffect(() => {
        const callbacks: (() => void)[] = []
        if (issues) {
            for (const issue of issues) {
                const callback = CommentManager.findComments(issue.id, (newComments, error) => {
                    if (error) {
                        setComments({...comments, [issue.id]: undefined})
                    } else {
                        setComments({...comments, [issue.id]: newComments})
                    }
                })
                callbacks.push(callback)
            }
        }
        return () => {
            for (const callback of callbacks) {
                callback()
            }
        }
    }, [issues])

    return comments
}