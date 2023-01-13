import * as React from 'react'
import { NavLink } from 'react-router-dom'

import * as UserIcon from '/src/images/user.png'

export const UsersLink = () => {
    return (
        <span>
            <NavLink to="/users">
                <img src={UserIcon} className='icon small'/>
                <span>Users</span>
            </NavLink>
        </span>
    )
}