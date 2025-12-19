import { NavLink } from 'react-router'
import UserIcon from '/src/images/user.png'

export const UsersLink = () => {
    return (
        <span>
            <NavLink to="/users" replace={true}>
                <img src={UserIcon} className='icon small'/>
                <span>Users</span>
            </NavLink>
        </span>
    )
}