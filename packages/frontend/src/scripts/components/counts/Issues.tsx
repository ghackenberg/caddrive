import * as React from 'react'

import { useIssues } from '../../hooks/route'

export const IssueCount = (props: { productId: string, milestoneId?: string, state?: 'open' | 'closed' }) => {
    const issues = useIssues(props.productId, props.milestoneId, props.state)
    return (
        <>
            {issues ? issues.length : '?'}
        </>
    )
}