import * as React from 'react'
import { Link } from 'react-router-dom'

import { User } from 'productboard-common'

import { useUsers } from '../../hooks/route'
import { LegalFooter } from '../snippets/LegalFooter'
import { Column, Table } from '../widgets/Table'
import { UserPictureWidget } from '../widgets/UserPicture'
import { LoadingView } from './Loading'

export const UserView = () => {

    // HOOKS

    const users = useUsers()

    // CONSTANTS

    const columns: Column<User>[] = [
        { label: '👤', content: user => (
            <Link to={`/users/${user.id}/settings`}>
                <UserPictureWidget user={user} class='icon medium round'/>
            </Link>
        ) },
        { label: 'Name', class: 'left nowrap fill', content: user => (
            <Link to={`/users/${user.id}/settings`}>
                {user.name}
            </Link>
        ) }
    ]

    // RETURN

    return (
        users ? (
            <main className="view user">
                <div>
                    <div>
                        <Table columns={columns} items={users}/>
                    </div>
                    <LegalFooter/>
                </div>
            </main>
        ) : (
            <LoadingView/>
        )
    )

}