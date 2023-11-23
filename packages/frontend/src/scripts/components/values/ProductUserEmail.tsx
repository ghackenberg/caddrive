import * as React from 'react'

import { useUser } from '../../hooks/entity'
import { useMembers } from '../../hooks/list'

export const ProductUserEmail = (props: { productId: string, userId: string, class?: string }) => {
    // HOOKS

    const members = useMembers(props.productId)
    const user = useUser(props.userId)

    // RETURN

    return (
        <span className={`value product_user_email ${props.class || ''}`}>
            {members && user ? (
                user.deleted ? (
                    <>
                        &lt;<del style={{opacity: 0.5}}>{user.email}</del>&gt;
                    </>
                ) : (
                    members.map(member => member.userId).includes(user.userId) ? (
                        <>
                            &lt;{user.email}&gt;
                        </>
                    ) : (
                        <>
                            &lt;<del>{user.email}</del>&gt;
                        </>
                    )
                )
            ) : (
                <>
                    &lt;<span className='loading'/>&gt;
                </>
            )}
        </span>
    )
}