import { useIssues } from '../../hooks/list.js'

export const IssueCount = (props: { productId: string, milestoneId?: string, state?: 'open' | 'closed' }) => {
    const issues = useIssues(props.productId, props.milestoneId, props.state)
    return (
        <>
            {issues ? issues.length : '?'}
        </>
    )
}