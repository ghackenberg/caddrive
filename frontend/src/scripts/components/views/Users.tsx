import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Clients
import { UserAPI } from '../../clients/rest'
// Links
import { UsersLink } from '../links/UsersLink'
// Widgets
import { Column, Table } from '../widgets/Table'
// Images
import * as AddIcon from '/src/images/add.png'
import * as UserIcon from '/src/images/user.png'

export const UsersView = () => {

    // Define entities
    const [users, setUsers] = useState<User[]>()

    // Load entities
    useEffect(() => { UserAPI.findUsers().then(setUsers) }, [])

    const columns: Column<User>[] = [
        {label: '', content: user => <Link to={`/users/${user.id}`}><img src={UserIcon}/></Link>},
        {label: 'Email', content: user => <Link to={`/users/${user.id}`}>{user.email}</Link>},
        {label: 'Name', content: user => <Link to={`/users/${user.id}`}>{user.name}</Link>},
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