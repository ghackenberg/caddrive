import * as React from 'react'

import { collectParts } from '../../functions/markdown'
import { useComments } from '../../hooks/list'

export const PartCount = (props: { productId: string, issueId: string }) => {
    const productId = props.productId
    const issueId = props.issueId

    const comments = useComments(productId, issueId)

    const initialCommentsPartCount = comments && comments.map(comment => collectParts(comment.text).length)
    const initialPartCount = initialCommentsPartCount && initialCommentsPartCount.reduce((a, b) => a + b, 0)

    const [commentsPartCount, setCommentsPartCount] = React.useState(initialCommentsPartCount)
    const [partCount, setPartCount] = React.useState(initialPartCount)

    React.useEffect(() => {
        if (comments) {
            setCommentsPartCount(comments.map(comment => collectParts(comment.text).length))
        } else {
            setCommentsPartCount(undefined)
        }
    }, [comments])

    React.useEffect(() => {
        if (commentsPartCount != undefined) {
            setPartCount(commentsPartCount.reduce((a, b) => a + b, 0))
        } else {
            setPartCount(undefined)
        }
    }, [commentsPartCount])

    return (
        <>
            {partCount !== undefined ? partCount : '?'}
        </>
    )
}