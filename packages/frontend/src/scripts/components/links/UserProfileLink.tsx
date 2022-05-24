import * as React from 'react'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { User } from 'productboard-common'
// Links
import { UsersLink } from './UsersLink'

export const UserProfileLink = (props: {user?: User}) => (
    <Fragment>
        <UsersLink/>
        { props.user ? (
            <span>
                <NavLink to={`/users/${props.user.id}`}>{props.user.name}</NavLink>
            </span>
        ) : (
            <span>
                <NavLink to={`/users/new`}>New user</NavLink>
            </span>
        )}
    </Fragment>  
)