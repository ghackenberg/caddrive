import * as React from 'react'
import { NavLink } from 'react-router-dom'
// Images
import * as AppIcon from '/src/images/app.png'
import * as UserIcon from '/src/images/user.png'

export const PageHeader = () => {
    return (
        <header>
            <div>
                <span>
                    <NavLink to="/products"><img src={AppIcon}/>ProductBoard</NavLink>
                </span>
            </div>
            <div>
                <span>
                    <NavLink to="/users"><img src={UserIcon}/>Users</NavLink>
                </span>
            </div>
        </header>
    )
}