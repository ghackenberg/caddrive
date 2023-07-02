import * as React from 'react'

import { collectParts } from '../../functions/markdown'
import { useIssue } from '../../hooks/entity'
import { useComments } from '../../hooks/list'

export const PartCount = (props: { productId: string, issueId: string }) => {
    const productId = props.productId
    const issueId = props.issueId

    const issue = useIssue(productId, issueId)
    const comments = useComments(issueId)

    const initialIssuePartCount = issue && collectParts(issue.text).length
    const initialCommentsPartCount = comments && comments.map(comment => collectParts(comment.text).length)
    const initialPartCount = initialIssuePartCount && initialCommentsPartCount && initialIssuePartCount + initialCommentsPartCount.reduce((a, b) => a + b, 0)

    const [issuePartCount, setIssuePartCount] = React.useState(initialIssuePartCount)
    const [commentsPartCount, setCommentsPartCount] = React.useState(initialCommentsPartCount)
    const [partCount, setPartCount] = React.useState(initialPartCount)

    React.useEffect(() => {
        if (issue) {
            setIssuePartCount(collectParts(issue.text).length)
        } else {
            setIssuePartCount(undefined)
        }
    }, [issue])

    React.useEffect(() => {
        if (comments) {
            setCommentsPartCount(comments.map(comment => collectParts(comment.text).length))
        } else {
            setCommentsPartCount(undefined)
        }
    }, [comments])

    React.useEffect(() => {
        if (issuePartCount !== undefined && commentsPartCount != undefined) {
            setPartCount(issuePartCount + commentsPartCount.reduce((a, b) => a + b, 0))
        } else {
            setPartCount(undefined)
        }
    }, [issuePartCount, commentsPartCount])

    return (
        <>
            {partCount !== undefined ? partCount : '?'}
        </>
    )
}