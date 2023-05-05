import * as React from 'react'

import { useMembers, useUser } from '../../hooks/route'

export const ProductUserNameWidget = (props: { productId: string, userId: string }) => {
    const { members } = useMembers(props.productId)
    const user = useUser(props.userId)

    if (members && user) {
        return (
            user.deleted ? (
                <del style={{opacity: 0.5}}>
                    {user.name}
                </del>
            ) : (
                members.map(member => member.userId).includes(user.id) ? (
                    <>
                        {user.name}
                    </>
                ) : (
                    <del>
                        {user.name}
                    </del>
                )
            )
        )
    } else {
        return (
            <>?</>
        )
    }
}