import * as React from 'react'

import { useTagAssignments } from '../../hooks/list'

export const TagAssignmentCount = (props: { tagId: string }) => {
    const tagAssignments = useTagAssignments(undefined, props.tagId)
    return (
        <>
            { tagAssignments ? tagAssignments.length : '?' }
        </>
    )
}