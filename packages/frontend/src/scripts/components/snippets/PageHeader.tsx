import * as React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { UserContext } from '../../contexts/User'

import * as AppIcon from '/src/images/app.png'
import * as UserIcon from '/src/images/user.png'

export const PageHeader = () => {

    const user = useContext(UserContext)

    return (
        <header>
            <div>
                <span>
                    <NavLink to="/products"><img src={AppIcon}/>ProductBoard</NavLink>
                </span>
            </div>
            <div>
                { user && user.permissions.includes('create:users') && (
                    <span>
                        <NavLink to="/users"><img src={UserIcon}/>Users</NavLink>
                    </span>
                )}
                <span>
                    { user && (
                        <NavLink to={`/users/${user.id}/settings`}>
                            <img src={`/rest/files/${user.pictureId}.jpg`}/>
                        </NavLink>
                    )}
                </span>
            </div>
        </header>
    )
    
}