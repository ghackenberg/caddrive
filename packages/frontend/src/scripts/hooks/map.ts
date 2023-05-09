import * as React from 'react'

import { Comment } from 'productboard-common'

import { CommentAPI } from '../clients/mqtt/comment'
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

    React.useEffect(() => {
        return CommentAPI.register({
            create(comment) {
                if (comments && comment.issueId in comments) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    for (const issue of issues) {
                        if (issue.id == comment.issueId) {
                            newComments[issue.id] = [...comments[issue.id].filter(other => other.id != comment.id), comment].sort(compare)
                        } else {
                            newComments[issue.id] = [...comments[issue.id]].sort(compare)
                        }
                    }
                    setComments(newComments)
                }
            },
            update(comment) {
                if (comments && comment.issueId in comments) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    for (const issue of issues) {
                        if (issue.id == comment.issueId) {
                            newComments[issue.id] = comments[issue.id].map(other => other.id == comment.id ? comment : other).sort(compare)
                        } else {
                            newComments[issue.id] = [...comments[issue.id]].sort(compare)
                        }
                    }
                    setComments(newComments)
                }
            },
            delete(comment) {
                if (comments && comment.issueId in comments) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    for (const issue of issues) {
                        if (issue.id == comment.issueId) {
                            newComments[issue.id] = comments[issue.id].filter(other => other.id != comment.id).sort(compare)
                        } else {
                            newComments[issue.id] = [...comments[issue.id]].sort(compare)
                        }
                    }
                    setComments(newComments)
                }
            }
        })
    })

    return comments
}