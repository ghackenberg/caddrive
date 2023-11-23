import * as React from 'react'

import { useUser } from '../../hooks/entity'
import { useMembers } from '../../hooks/list'

export const ProductUserNameWidget = (props: { productId: string, userId: string, class?: string }) => {
    // HOOKS

    const members = useMembers(props.productId)
    const user = useUser(props.userId)

    // RETURN

    return (
        <span className={`value product_user_name ${props.class || ''}`}>
            {members && user ? (
                user.deleted ? (
                    <del style={{opacity: 0.5}}>
                        {user.name}
                    </del>
                ) : (
                    members.map(member => member.userId).includes(user.userId) ? (
                        <>
                            {user.name}
                        </>
                    ) : (
                        <del>
                            {user.name}
                        </del>
                    )
                )
            ) : (
                <span className='loading'/>
            )}
        </span>
    )
}