import * as React from 'react'

import { useComments } from '../../hooks/list'

export const CommentCount = (props: { issueId: string }) => {
    const comments = useComments(props.issueId)
    return (
        <>
            {comments ? comments.length : '?'}
        </>
    )
}