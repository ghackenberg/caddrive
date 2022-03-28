import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { User } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
// Links
import { UsersLink } from '../links/UsersLink'
// Widgets
import { Column, Table } from '../widgets/Table'
// Images
import * as DeleteIcon from '/src/images/delete.png'

export const UsersView = () => {

    // Define entities
    const [users, setUsers] = useState<User[]>()

    // Load entities
    useEffect(() => { UserManager.findUsers().then(setUsers) }, [])

    async function deleteUser(user: User) {
        if (confirm('Do you really want to delete this user?')) {
            await UserManager.deleteUser(user.id)
            setUsers(users.filter(other => other.id != user.id))
        }
    }

    const columns: Column<User>[] = [
        {label: 'Picture', content: user => <img src={`/rest/files/${user.pictureId}.jpg`} className='big'/>},
        {label: 'Name', class: 'left nowrap', content: user => <Link to={`/users/${user.id}`}>{user.name}</Link>},
        {label: 'Email', class: 'left nowrap fill', content: user => <Link to={`/users/${user.id}`}>{user.email}</Link>},
        {label: '', content: user => <a onClick={_event => deleteUser(user)}><img src={DeleteIcon} className='small'/></a>}
    ]

    return (
        <main className="view users">
            <header>
                <div>
                    <UsersLink/>
                </div>
            </header>
            <main>
                <div>
                    <Link to={`/users/new/settings`}>
                        New user
                    </Link>
                    { users && <Table columns={columns} items={users}/> }
                </div>
            </main>
        </main>
    )

}