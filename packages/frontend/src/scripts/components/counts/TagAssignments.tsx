import * as React from 'react'

import { useMembers } from '../../hooks/list'

export const TagAssignmentCount = (props: { productId?: string, tagId?: string }) => {
    const members = useMembers(props.productId)
    
    return (
        <>
            {members ? members.length : '?'}
        </>
    )
}