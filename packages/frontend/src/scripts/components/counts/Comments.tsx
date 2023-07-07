import * as React from 'react'

import { useComments } from '../../hooks/list'

export const CommentCount = (props: { productId: string, issueId: string }) => {
    const comments = useComments(props.productId, props.issueId)
    return (
        <>
            {comments ? comments.length : '?'}
        </>
    )
}