import * as React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { UserContext } from '../../contexts/User'
import { UserPictureWidget } from '../widgets/UserPicture'

import * as AppIcon from '/src/images/app.png'
import * as UserIcon from '/src/images/user.png'

export const PageHeader = () => {

    const { contextUser } = useContext(UserContext)

    return (
        <header>
            <div>
                <span>
                    <NavLink to="/products">
                        <img src={AppIcon} className='icon small'/>
                        ProductBoard
                    </NavLink>
                </span>
            </div>
            <div>
                <span>
                    {contextUser && contextUser.permissions && contextUser.permissions.includes('create:users') && (
                        <NavLink to="/users">
                            <img src={UserIcon} className='icon small'/>
                            Users
                        </NavLink>
                    )}
                </span>
                <span>
                    {contextUser && (
                        <NavLink to={`/users/${contextUser.id}/settings`}>
                            <UserPictureWidget user={contextUser} background='gray' class='icon small round'/>
                        </NavLink>
                    )}
                </span>
            </div>
        </header>
    )
    
}