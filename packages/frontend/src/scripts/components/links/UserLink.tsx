import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { User } from 'productboard-common'

import UserIcon from '/src/images/user.png'

export const UserLink = (props: {user?: User}) => (
    props.user ? (
        <span>
            <NavLink to={`/users/${props.user.id}`} replace={true}>
                <img src={UserIcon} className='icon small'/>
                <span>{props.user.name}</span>
            </NavLink>
        </span>
    ) : (
        <span>
            <NavLink to={`/users/new`} replace={true}>
                <img src={UserIcon} className='icon small'/>
                <span>New user</span>
            </NavLink>
        </span>
    )
)