import * as React from 'react'

import { useIssues } from '../../hooks/list'

export const IssueCount = (props: { productId: string, milestoneId?: string, state?: 'open' | 'closed', tagId?: string }) => {
    const issues = useIssues(props.productId, props.milestoneId, props.state, props.tagId)
    return (
        <>
            {issues ? issues.length : '?'}
        </>
    )
}