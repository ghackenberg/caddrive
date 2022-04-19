import { Member, User } from 'productboard-common'
import * as React from 'react'
import { Fragment } from 'react'

export const ProductUserEmailWidget = (props: { user: User, members: Member[] }) => {
    return (
        <Fragment>
            {props.user.deleted ? (
                <del style={{opacity: 0.5}}>
                    {props.user.email}
                </del>
            ) : (
                <Fragment>
                    {props.members.map(member => member.userId).includes(props.user.id) ? (
                        props.user.email
                    ) : (
                        <del>
                            {props.user.email}
                        </del>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}