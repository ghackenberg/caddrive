import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User } from 'fhooe-audit-platform-common'
import { UserAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { UserList } from '../widgets/UserList'

export const Users = () => {
    const [users, setUsers] = useState<User[]>(null)
    useEffect(() => { UserAPI.findAll().then(setUsers) }, [])
    return (
        <div className="view users">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Welcome Page</Link> &rsaquo; Users</h1>
                <h2>Available users</h2>
                {users ? <UserList list={users}/> : <p>Loading...</p>}
            </main>
        </div>
    )
}