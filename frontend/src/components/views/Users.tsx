import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User } from 'fhooe-audit-platform-common'
import { UserAPI } from '../../api'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { UserList } from '../widgets/UserList'

export const Users = () => {
    const [users, setUsers] = useState<User[]>(null)
    useEffect(() => { UserAPI.findAll().then(setUsers) }, [])
    return (
        <React.Fragment>
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Index</Link> &rsaquo; Users</h1>
                {users ? <UserList list={users}/> : <p>Loading...</p>}
            </main>
        </React.Fragment>
    )
}