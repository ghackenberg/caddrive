import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Clients
import { UserAPI } from '../../../clients/rest'
// Links
import { UsersLink } from '../../links/UsersLink'
// Widgets
import { Column, Table } from '../../widgets/Table'
// Images
import * as AddIcon from '/src/images/add.png'
import * as UserIcon from '/src/images/user.png'
import * as EditIcon from '/src/images/edit.png'
import * as DeleteIcon from '/src/images/delete.png'

export const UserListView = () => {

    // Define entities
    const [users, setUsers] = useState<User[]>()

    // Load entities
    useEffect(() => { UserAPI.findUsers().then(setUsers) }, [])

    async function deleteUser(id: string) {
        await UserAPI.deleteUser(id)
        setUsers(users.filter(user => user.id != id))
    }

    const columns: Column<User>[] = [
        {label: '', content: _user => <a><img src={UserIcon}/></a>},
        {label: 'Email', content: user => user.email},
        {label: 'Name', content: user => user.name},
        {label: '', content: user => <Link to={`/users/${user.id}`}><img src={EditIcon}/></Link>},
        {label: '', content: user => <a href="#" onClick={_event => deleteUser(user.id)}><img src={DeleteIcon}/></a>},
        {label: '', content: () => '', class: 'fill'}
    ]

    return (
        <div className="view users">
            <header>
                <nav>
                    <UsersLink/>
                </nav>
            </header>
            <main>
                <div>
                    <h1>
                        Users
                        <Link to={`/users/new`}>
                            <img src={AddIcon}/>
                        </Link>
                    </h1>
                    { users && <Table columns={columns} items={users}/> }
                </div>
            </main>
        </div>
    )

}