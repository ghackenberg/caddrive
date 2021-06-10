import { User } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'

export const UserList = (props: {list: User[]}) => (
    <ul>
        {props.list.map(user =>
            <li key={user.id}>
                <Link to={`/users/${user.id}`}>User <em>{user.id}</em></Link>
            </li>
        )}
        <li>
            <Link to="/users/new">User</Link>
        </li>
    </ul>
)