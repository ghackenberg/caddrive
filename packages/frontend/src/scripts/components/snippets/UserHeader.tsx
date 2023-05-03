import * as React from 'react'
import { NavLink, useParams } from 'react-router-dom'

import { UserManager } from '../../managers/user'
import { UserLink } from '../links/UserLink'

import SettingIcon from '/src/images/setting.png'

export const UserHeader = () => {
    // PARAMS

    const params = useParams<{ user: string }>()

    // INITIAL STATES

    const initialUser = params.user == 'new' ? undefined : UserManager.getUserFromCache(params.user)

    // STATES

    const [user, setUser] = React.useState(initialUser)

    // EFFECTS

    React.useEffect(() => {
        params.user == 'new' ? setUser(undefined) : UserManager.getUser(params.user).then(setUser)
    }, [params.user])

    return (
        <header className='view user'>
            <div className='entity'>
                <UserLink user={user}/>
            </div>
            <div className='tabs'>
                <span>
                    {params.user == 'new' ? (
                        <a className="active">
                            <img src={SettingIcon} className='icon small'/>
                            <span>Settings</span>
                        </a>
                    ) : (
                        <NavLink to={`/users/${params.user}`}>
                            <img src={SettingIcon} className='icon small'/>
                            <span>Settings</span>
                        </NavLink>
                    )}
                </span>
            </div>
        </header>
    )
}