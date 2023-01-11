import * as React from 'react'

import { Member, User } from 'productboard-common'

export const ProductUserEmailWidget = (props: { user: User, members: Member[] }) => {
    return (
        <>
            {props.user.deleted ? (
                <>
                    &lt;<del style={{opacity: 0.5}}>{props.user.email}</del>&gt;
                </>
            ) : (
                <>
                    {props.members.map(member => member.userId).includes(props.user.id) ? (
                        <>
                            &lt;{props.user.email}&gt;
                        </>
                    ) : (
                        <>
                            &lt;<del>{props.user.email}</del>&gt;
                        </>
                    )}
                </>
            )}
        </>
    )
}