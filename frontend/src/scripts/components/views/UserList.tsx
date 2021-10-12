import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { UsersLink } from '../snippets/Links'
import { UserSearchBar } from '../widgets/SearchBar'
import { Column, Table } from '../widgets/Table'
import { UserAPI } from '../../rest'
import { User } from 'fhooe-audit-platform-common'
import * as UserIcon from '/src/images/user.png'
import * as DeleteIcon from '../../../images/delete.png'

export const UserListView = () => {

    // Define entities
    const [users, setUsers] = useState<User[]>()

    // Load entities
    useEffect(() => { UserAPI.findUsers().then(setUsers) }, [])

    const columns: Column<User>[] = [
        {label: 'Icon', content: _user => <img src={UserIcon} style={{width: '1em'}}/>},
        {label: 'Name', content: user => <Link to={`/users/${user.id}`}>{user.name}</Link>},
        {label: 'Email', content: user => <Link to={`/users/${user.id}`}>{user.email}</Link>},
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
                <UserSearchBar change={setUsers}/>
                { users && <Table columns={columns} items={users}/> }
            </main>
        </div>
    )

}