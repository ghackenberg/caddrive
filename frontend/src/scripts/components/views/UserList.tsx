import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Clients
import { UserAPI } from '../../clients/rest'
// Snippets
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
// Links
import { UsersLink } from '../links/UsersLink'
// Searches
import { UserSearch } from '../searches/UserSearch'
// Widgets
import { Column, Table } from '../widgets/Table'
// Images
import * as UserIcon from '/src/images/user.png'
import * as DeleteIcon from '../../../images/delete.png'

export const UserListView = () => {

    // Define entities
    const [users, setUsers] = useState<User[]>()

    // Load entities
    useEffect(() => { UserAPI.findUsers().then(setUsers) }, [])

    const columns: Column<User>[] = [
        {label: 'Icon', content: _user => <img src={UserIcon} style={{width: '1em'}}/>},
        {label: 'Email', content: user => <Link to={`/users/${user.id}`}>{user.email}</Link>},
        {label: 'Name', content: user => <Link to={`/users/${user.id}`}>{user.name}</Link>},
        {label: 'Delete', content: _audit => <a href="#" onClick={_event => {}}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
    ]

    return (
        <div className="view users">
            <Header/>
            <Navigation/>
            <main>
                <nav>
                    <UsersLink/>
                </nav>
                <h1>User list (<Link to={`/users/new`}>+</Link>)</h1>
                <UserSearch change={setUsers}/>
                { users && <Table columns={columns} items={users}/> }
            </main>
        </div>
    )

}