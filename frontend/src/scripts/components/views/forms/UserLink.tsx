import { User } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const UserLink = (props: {user?: User}) => {

    return (
        <Fragment>
            <span>
                <Link to="/">Welcome Page</Link>
            </span>
            <span>
                <Link to='/users'>Users</Link>
            </span>
            { props.user ? (
            <span>
                <Link to={`/users/${props.user.id}`}>{'User ' + props.user.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/users/new`}>new User</Link>
            </span>
            )}
        </Fragment>  
    )
}