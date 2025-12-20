import { UserRead } from 'productboard-common'
import { NavLink } from 'react-router'
import { useUsers } from '../../hooks/list.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import { Column, Table } from '../widgets/Table.js'
import { UserPictureWidget } from '../widgets/UserPicture.js'
import { LoadingView } from './Loading.js'
import UserIcon from '/src/images/user.png'

export const UserView = () => {

    // ENTITIES

    const users = useUsers()

    // CONSTANTS

    const columns: Column<UserRead>[] = [
        { label: '👤', content: user => (
            <NavLink to={`/users/${user.userId}/settings`}>
                <UserPictureWidget userId={user.userId} class='icon medium round'/>
            </NavLink>
        ) },
        { label: 'Name', class: 'left nowrap fill', content: user => (
            <NavLink to={`/users/${user.userId}/settings`}>
                {user.name}
            </NavLink>
        ) }
    ]

    // RETURN

    return (
        users ? (
            <main className="view user">
                <div>
                    { users.length == 0 ? (
                        <div className='main center'>
                            <div>
                                <img src={UserIcon}/>
                                <p>No user found.</p>
                            </div>
                        </div>
                    ) : (
                        <div className='main'>
                            <Table columns={columns} items={users}/>
                        </div>
                    ) }
                    <LegalFooter/>
                </div>
            </main>
        ) : (
            <LoadingView/>
        )
    )

}