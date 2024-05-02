import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { UserRead } from 'productboard-common'

import UserIcon from '/src/images/user.png'

export const UserLink = (props: {user?: UserRead}) => (
    props.user ? (
        <span>
            <NavLink to={`/users/${props.user.userId}`} replace={true}>
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