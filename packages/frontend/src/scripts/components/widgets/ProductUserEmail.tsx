import { Member, User } from 'productboard-common'
import * as React from 'react'
import { Fragment } from 'react'

export const ProductUserEmailWidget = (props: { user: User, members: Member[] }) => {
    return (
        <Fragment>
            {props.user.deleted ? (
                <React.Fragment>
                    &lt;<del style={{opacity: 0.5}}>{props.user.email}</del>&gt;
                </React.Fragment>
            ) : (
                <Fragment>
                    {props.members.map(member => member.userId).includes(props.user.id) ? (
                        <React.Fragment>
                            &lt;{props.user.email}&gt;
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            &lt;<del>{props.user.email}</del>&gt;
                        </React.Fragment>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}