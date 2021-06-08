import { User } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'

export class UserList extends React.Component<{list: User[]}> {
    render() {
        return (
            <ul>
                {this.props.list.map(user =>
                    <li key={user.id} style={{backgroundImage: 'url(/images/user.png'}}>
                        <Link to={`/users/${user.id}`}>User <em>{user.id}</em></Link>
                    </li>
                )}
            </ul>
        )
    }
}