import * as React from 'react'
import { Fragment } from 'react'

import { Member, User } from 'productboard-common'

export const ProductUserNameWidget = (props: { user: User, members: Member[] }) => {
    return (
        <Fragment>
            {props.user.deleted ? (
                <del style={{opacity: 0.5}}>
                    {props.user.name}
                </del>
            ) : (
                <Fragment>
                    {props.members.map(member => member.userId).includes(props.user.id) ? (
                        props.user.name
                    ) : (
                        <del>
                            {props.user.name}
                        </del>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}