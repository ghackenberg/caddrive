import { User } from 'fhooe-audit-platform-common'
import * as React from 'react'

export class UserList extends React.Component<{list: User[]}> {
    render() {
        return (
            <ul>
                {this.props.list.map(user =>
                    <li key={user.id}>
                        User {user.id}
                    </li>
                )}
            </ul>
        )
    }
}