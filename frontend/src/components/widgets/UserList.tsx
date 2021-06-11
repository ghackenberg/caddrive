import { User } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'

export const UserList = (props: {list: User[]}) => (
    <div className="widget list user_list">
        <ul>
            {props.list.map(user =>
                <li key={user.id}>
                    <Link to={`/users/${user.id}`}><img src="/images/user.png"/>User <em>{user.id}</em></Link>
                </li>
            )}
            <li>
                <Link to="/users/new"><img src="/images/create.png"/>User</Link>
            </li>
        </ul>
    </div>
)