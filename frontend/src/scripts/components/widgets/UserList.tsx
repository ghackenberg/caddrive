import { User } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'
import * as UserIcon from '/src/images/user.png'
import * as CreateIcon from '/src/images/create.png'

export const UserList = (props: {list: User[]}) => (
    <div className="widget list user_list">
        <ul>
            {props.list.map(user =>
                <li key={user.id}>
                    <Link to={`/users/${user.id}`}><img src={UserIcon}/>User <em>{user.id}</em></Link>
                </li>
            )}
            <li>
                <Link to="/users/new"><img src={CreateIcon}/>User</Link>
            </li>
        </ul>
    </div>
)