import * as React from 'react'
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { UserSearchBar } from '../widgets/SearchBar'
import { Column, Table } from '../widgets/Table'
import { UserAPI } from '../../rest'
import { User } from 'fhooe-audit-platform-common'
import * as UserIcon from '/src/images/user.png'

export const UsersView = () => {
    const [users, setUsers] = useState<User[]>(null)

    useEffect(() => { UserAPI.findUsers().then(setUsers) }, [])

    const columns: Column<User>[] = [
        {label: 'Icon', content: _user => <img src={UserIcon} style={{width: '1em'}}/>},
        {label: 'Username', content: user => <b>{user.name}</b>},
        {label: 'Email', content: user => user.email},
        {label: 'Link', content: user => <Link to={`/users/${user.id}`}>Details</Link>}
    ]

    return (
        <div className="view users">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Welcome Page</Link> 
                        </span>
                        <span>
                            <a>Users</a>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available users</h2>
                <UserSearchBar change={setUsers} addUser={true}/>
                {users && <Table columns={columns} items={users} create='User'/>}
            </main>
        </div>
    )
}