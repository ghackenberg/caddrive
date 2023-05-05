import * as React from 'react'

import { useMembers } from '../../hooks/route'

export const MemberCount = (props: { productId: string }) => {
    const { members } = useMembers(props.productId)
    return (
        <>
            {members ? members.length : '?'}
        </>
    )
}