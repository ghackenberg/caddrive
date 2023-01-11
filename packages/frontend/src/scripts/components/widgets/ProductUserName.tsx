import * as React from 'react'

import { Member, User } from 'productboard-common'

export const ProductUserNameWidget = (props: { user: User, members: Member[] }) => {
    return (
        <>
            {props.user.deleted ? (
                <del style={{opacity: 0.5}}>
                    {props.user.name}
                </del>
            ) : (
                <>
                    {props.members.map(member => member.userId).includes(props.user.id) ? (
                        props.user.name
                    ) : (
                        <del>
                            {props.user.name}
                        </del>
                    )}
                </>
            )}
        </>
    )
}