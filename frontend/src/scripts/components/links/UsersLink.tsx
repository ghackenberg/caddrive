import * as React from 'react'
import { NavLink } from 'react-router-dom'
// Images
import * as UserIcon from '/src/images/user.png'

export const UsersLink = () => {
    return (
        <span>
            <NavLink to="/users">
                <img src={UserIcon}/>
                Users
            </NavLink>
        </span>
    )
}