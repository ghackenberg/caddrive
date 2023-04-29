import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { User } from 'productboard-common'

import { UsersLink } from './UsersLink'

export const UserLink = (props: {user?: User}) => (
    <>
        <UsersLink/>
        { props.user ? (
            <span>
                <NavLink to={`/users/${props.user.id}`}>
                    {props.user.name}
                </NavLink>
            </span>
        ) : (
            <span>
                <NavLink to={`/users/new`}>
                    New user
                </NavLink>
            </span>
        )}
    </>  
)