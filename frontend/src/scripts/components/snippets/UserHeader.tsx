import * as React from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Links
import { UserLink } from '../links/UserLink'
// Images
import * as SettingIcon from '/src/images/setting.png'

export const UserHeader = (props: {user?: User}) => {
    return (
        <header>
            <div>
                <UserLink user={props.user}/>
            </div>
            <div>
                <span>
                    {props.user ? (
                        <NavLink to={`/users/${props.user.id}`}>
                            <img src={SettingIcon}/>
                            Settings
                        </NavLink>
                    ) : (
                        <a className="active">
                            <img src={SettingIcon}/>
                            Settings
                        </a>
                    )}
                </span>
            </div>
        </header>
    )
}