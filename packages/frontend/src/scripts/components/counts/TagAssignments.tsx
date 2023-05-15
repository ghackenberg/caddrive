import * as React from 'react'

import { useTagAssignments } from '../../hooks/list'

export const TagAssignmentCount = (props: { productId?: string, tagId?: string }) => {
    const tagAssignments = useTagAssignments(undefined, props.tagId)
    //console.log(tagAssignments)

    return (
        <>
            {tagAssignments && tagAssignments.length}
        </>
    )
}