import * as React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth0 } from '@auth0/auth0-react'

import { UserContext } from '../../contexts/User'
import { UserPictureWidget } from '../widgets/UserPicture'

import AppIcon from '/src/images/app.png'
import LoadIcon from '/src/images/load.png'

export const PageHeader = () => {

    const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

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
                    {isLoading ? (
                        <a>
                            <img src={LoadIcon} className='icon small animation spin'/>
                        </a>
                    ) : (
                        isAuthenticated ? (
                            contextUser ? (
                                <NavLink to={`/users/${contextUser.id}/settings`}>
                                    <UserPictureWidget user={contextUser} background='gray' class='icon small round'/>
                                </NavLink>
                            ) : (
                                <a>
                                    <img src={LoadIcon} className='icon small animation spin'/>
                                </a>
                            )
                        ) : (
                            <button onClick={loginWithRedirect} className='button fill white' style={{lineHeight: '100%'}}>
                                Sign up / in
                            </button>
                        )
                    )}
                </span>
            </div>
        </header>
    )
    
}