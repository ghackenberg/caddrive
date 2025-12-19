import { useComments } from '../../hooks/list.js'

export const CommentCount = (props: { productId: string, issueId: string }) => {
    const comments = useComments(props.productId, props.issueId)
    return (
        <>
            {comments ? comments.length : '?'}
        </>
    )
}