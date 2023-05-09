import * as React from 'react'

import { useMembers, useUser } from '../../hooks/route'

export const ProductUserEmailWidget = (props: { productId: string, userId: string }) => {
    const members = useMembers(props.productId)
    const user = useUser(props.userId)

    if (members && user) {
        return (
            user.deleted ? (
                <>
                    &lt;<del style={{opacity: 0.5}}>{user.email}</del>&gt;
                </>
            ) : (
                members.map(member => member.userId).includes(user.id) ? (
                    <>
                        &lt;{user.email}&gt;
                    </>
                ) : (
                    <>
                        &lt;<del>{user.email}</del>&gt;
                    </>
                )
            )
        )
    } else {
        return (
            <>?</>
        )
    }
}