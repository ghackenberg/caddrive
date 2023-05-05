import * as React from 'react'
import { NavLink, useParams } from 'react-router-dom'

import { UserManager } from '../../managers/user'
import { UserLink } from '../links/UserLink'

import SettingIcon from '/src/images/setting.png'

export const UserHeader = () => {
    // PARAMS

    const { userId } = useParams<{ userId: string }>()

    // INITIAL STATES

    const initialUser = userId == 'new' ? undefined : UserManager.getUserFromCache(userId)

    // STATES

    const [user, setUser] = React.useState(initialUser)

    // EFFECTS

    React.useEffect(() => {
        let exec = true
        userId == 'new' ? setUser(undefined) : UserManager.getUser(userId).then(user => exec && setUser(user))
        return () => { exec = false }
    }, [userId])

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