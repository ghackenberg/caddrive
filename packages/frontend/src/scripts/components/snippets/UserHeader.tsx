import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { User } from 'productboard-common'

import { UserLink } from '../links/UserLink'

import SettingIcon from '/src/images/setting.png'

export const UserHeader = (props: {user?: User}) => (
    <header>
        <div>
            <UserLink user={props.user}/>
        </div>
        <div>
            <span>
                {props.user ? (
                    <NavLink to={`/users/${props.user.id}`}>
                        <img src={SettingIcon} className='icon small'/>
                        <span>Settings</span>
                    </NavLink>
                ) : (
                    <a className="active">
                        <img src={SettingIcon} className='icon small'/>
                        <span>Settings</span>
                    </a>
                )}
            </span>
        </div>
    </header>
)