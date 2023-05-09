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
        let exec = true
        if (issues) {
            Promise.all(issues.map(issue => CommentManager.findComments(issue.id))).then(comments => {
                if (exec) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    issues.forEach((issue, index) => {
                        newComments[issue.id] = comments[index].sort(compare)
                    })
                    setComments(newComments)
                }
            })
        }
        return () => { exec = false }
    }, [issues])

    return comments
}