import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { User } from 'productboard-common'

import { UserManager } from '../../managers/user'
import { Column, Table } from '../widgets/Table'
import { UserPictureWidget } from '../widgets/UserPicture'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'

export const UserView = () => {

    // INITIAL STATES

    const initialUsers = UserManager.findUsersFromCache()

    // STATES

    // - Entities
    const [users, setUsers] = useState<User[]>(initialUsers)

    // EFFECTS

    // - Entities
    useEffect(() => { UserManager.findUsers().then(setUsers) }, [])

    // FUNCTIONS

    async function deleteUser(user: User) {
        if (confirm('Do you really want to delete this user?')) {
            await UserManager.deleteUser(user.id)
            setUsers(users.filter(other => other.id != user.id))
        }
    }

    // CONSTANTS

    const columns: Column<User>[] = [
        { label: '👤', content: user => (
            <Link to={`/users/${user.id}/settings`}>
                <UserPictureWidget user={user} class='icon medium round'/>
            </Link>
        ) },
        { label: 'Name', class: 'left nowrap', content: user => (
            <Link to={`/users/${user.id}/settings`}>
                {user.name}
            </Link>
        ) },
        { label: 'Email', class: 'left nowrap fill', content: user => (
            <Link to={`/users/${user.id}/settings`}>
                {user.email}
            </Link>
        ) },
        { label: '🛠️', class: 'center', content: user => (
            <a onClick={() => deleteUser(user)}>
                <img src={DeleteIcon} className='icon medium pad'/>
            </a>
        ) }
    ]

    // RETURN

    return (
        users ? (
            <main className="view user">
                <div>
                    <Table columns={columns} items={users}/>
                </div>
            </main>
        ) : (
            <LoadingView/>
        )
    )

}