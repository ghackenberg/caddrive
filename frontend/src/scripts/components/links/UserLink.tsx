import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Links
import { UsersLink } from './UsersLink'

export const UserLink = (props: {user?: User}) => {

    return (
        <Fragment>
            <UsersLink/>
            { props.user ? (
                <span>
                    <Link to={`/users/${props.user.id}`}>{props.user.name}</Link>
                </span>
            ) : (
                <span>
                    <Link to={`/users/new`}>New user</Link>
                </span>
            )}
        </Fragment>  
    )

}