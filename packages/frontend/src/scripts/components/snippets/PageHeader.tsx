import * as React from 'react'
import { useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { UserContext } from '../../contexts/User'
import { UserPictureWidget } from '../widgets/UserPicture'

import AppIcon from '/src/images/app.png'
import LoadIcon from '/src/images/load.png'

export const PageHeader = () => {
    
    const { pathname } = useLocation()

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
                    {contextUser === undefined && (
                        <a>
                            <img src={LoadIcon} className='icon small animation spin'/>
                        </a>
                    )}
                    {contextUser === null && !pathname.startsWith('/auth') && (
                        <NavLink to='/auth' className='button fill white' style={{lineHeight: '100%'}}>
                            Sign up / in
                        </NavLink>
                    )}
                    {contextUser && !pathname.startsWith('/auth') && (
                        <NavLink to={`/users/${contextUser.id}/settings`}>
                            <UserPictureWidget user={contextUser} background='gray' class='icon small round'/>
                        </NavLink>
                    )}
                </span>
            </div>
        </header>
    )
    
}