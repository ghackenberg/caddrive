import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { useRouteUser } from '../../hooks/route'
import { UserLink } from '../links/UserLink'

import SettingIcon from '/src/images/setting.png'

export const UserHeader = () => {
    // HOOKS

    const { userId, user } = useRouteUser()

    // RETURN

    return (
        <header className='view user'>
            <div className='entity'>
                <UserLink user={user}/>
            </div>
            <div className='tabs'>
                <span>
                    {userId == 'new' ? (
                        <a className="active">
                            <img src={SettingIcon} className='icon small'/>
                            <span>Settings</span>
                        </a>
                    ) : (
                        <NavLink to={`/users/${userId}`} replace={true}>
                            <img src={SettingIcon} className='icon small'/>
                            <span>Settings</span>
                        </NavLink>
                    )}
                </span>
            </div>
        </header>
    )
}