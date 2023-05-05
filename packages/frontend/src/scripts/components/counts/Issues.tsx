import * as React from 'react'

import { useIssues } from '../../hooks/route'

export const IssueCount = (props: { productId: string }) => {
    const issues = useIssues(props.productId)
    return (
        <>
            {issues ? issues.length : '?'}
        </>
    )
}