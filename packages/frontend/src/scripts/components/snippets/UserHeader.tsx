import { NavLink, useParams } from 'react-router'
import { useUser } from '../../hooks/entity.js'
import { UserLink } from '../links/UserLink.js'
import SettingIcon from '/src/images/setting.png'

export const UserHeader = () => {
    // PARAMS

    const { userId } = useParams<{ userId: string }>()

    // HOOKS

    const user = useUser(userId)

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