import { MemberRole, UserRead } from 'productboard-common'
import { FormEvent, Fragment, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router'
import { CacheAPI } from '../../clients/cache.js'
import { MemberClient } from '../../clients/rest/member.js'
import { UserClient } from '../../clients/rest/user.js'
import { AccountContext } from '../../contexts/Account.js'
import { UserContext } from '../../contexts/User.js'
import { back } from '../../functions/history.js'
import { useMember, useProduct } from '../../hooks/entity.js'
import { useMembers } from '../../hooks/list.js'
import { ButtonInput } from '../inputs/ButtonInput.js'
import { TextInput } from '../inputs/TextInput.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter.js'
import { ProductView3D } from '../widgets/ProductView3D.js'
import { Column, Table } from '../widgets/Table.js'
import { UserPictureWidget } from '../widgets/UserPicture.js'
import { LoadingView } from './Loading.js'
import DeleteIcon from '/src/images/delete.png'
import RightIcon from '/src/images/part.png'
import LeftIcon from '/src/images/setting.png'

const ROLES: MemberRole[] = ['manager', 'engineer', 'customer']

export const ProductMemberSettingView = () => {

    // CONTEXTS

    const { contextUser } = useContext(UserContext)
    const { contextAccount } = useContext(AccountContext)

    // LOCATION

    const { hash } = useLocation()

    // PARAMS

    const { productId, memberId } = useParams<{ productId: string, memberId: string }>()

    // ENTITIES

    const product = useProduct(productId)
    const members = useMembers(productId)
    const member = useMember(productId, memberId)
    
    // INITIAL STATES

    const initialUser = member ? CacheAPI.getUser(member.userId) : undefined
    const initialRole = member ? member.role : 'customer'

    // STATES
    
    // - Entities
    const [users, setUsers] = useState<UserRead[]>()
    const [user, setUser] = useState<UserRead>(initialUser)
    // - Computations
    const [names, setNames] = useState<React.ReactNode[]>()
    // - Values
    const [role, setRole] = useState<MemberRole>(initialRole)
    // - Interactions
    const [query, setQuery] = useState<string>('')

    // EFFECTS

    // - Entities
    useEffect(() => {
        let exec = true
        UserClient.findUsers(productId, query).then(users => exec && setUsers(users))
        return () => { exec = false }
    }, [productId, query])
    useEffect(() => {
        let exec = true
        member && UserClient.getUser(member.userId).then(user => exec && setUser(user))
        return () => { exec = false }
    }, [member] )

    // - Values
    useEffect(() => { member && setRole(member.role) }, [member] )

    // - Computations
    useEffect(() => {
        if (users) {
            setNames(users.map(user => {
                const name = user.name || ''
                const index = name.toLowerCase().indexOf(query.toLowerCase())
                const before = name.substring(0, index)
                const between = name.substring(index, index + query.length)
                const after = name.substring(index + query.length)
                return <Fragment>{before}<mark>{between}</mark>{after}</Fragment>
            }))
        }
    }, [users])

    // FUNCTIONS

    async function onSubmit(event: FormEvent) {
        // TODO handle unmount!
        event.preventDefault()
        if (memberId == 'new') {
            if (confirm('Do you really want to add this member?')) {
                await MemberClient.addMember(productId, { userId: user.userId, role: role })
                await back()
            }
        } else {
            if (confirm('Do you really want to change this member?')) {
                await MemberClient.updateMember(productId, memberId, { role: role })
                await back()
            }
        }
    }

    function handleClick(user: UserRead) {
        setUser(user)
    }

    // CONSTANTS

    const selectedUserColumns: Column<UserRead>[] = [
        { label: '👤', class: 'center', content: user => (
            <UserPictureWidget userId={user.userId} class='icon medium round'/>
        ) },
        { label: 'Name', class: 'left fill', content: user => (
            user ? user.name : '?'
        ) },
        { label: '🛠️', class: 'center', content: () => (
            memberId == 'new' && (
                <a onClick={() => setUser(null)}>
                    <img src={DeleteIcon} className='icon medium pad'/>
                </a>
            )
        ) }
    ]

    const queriedUserColumns: Column<UserRead>[] = [
        { label: '👤', class: 'center', content: user => (
            <UserPictureWidget userId={user.userId} class='icon medium round'/>
        ) },
        { label: 'Name', class: 'left fill', content: (_, index) => (
            names ? names[index] : '?'
        ) }
    ]

    const items: ProductFooterItem[] = [
        { text: 'Form view', image: LeftIcon, hash: '' },
        { text: 'Model view', image: RightIcon, hash: '#model' }
    ]
    
    // RETURN

    return (
        (product && members) ? (
            product.deleted ? (
                <Navigate to='/'/>
            ) : (
                <>
                    <main className={`view product-member-setting sidebar ${!hash ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='main'>
                                <h1>
                                    {memberId == 'new' ? (
                                        'New member'
                                    ) : (
                                        'Member settings'
                                    )}
                                </h1>
                                <form onSubmit={onSubmit}>
                                    {user ? (
                                        <>
                                            <div>
                                                <div>
                                                    <label>User</label>
                                                </div>
                                                <div>
                                                    <Table items={[user]} columns={selectedUserColumns}/>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <label>Role</label>
                                                </div>
                                                <div>
                                                    <select value={role} onChange={(event) => setRole(event.currentTarget.value as MemberRole)} className='button fill lightgray'> 
                                                        {ROLES.map(role => (
                                                            <option key={role} value={role}>
                                                                {role}
                                                            </option>
                                                        ))}    
                                                    </select>
                                                </div>
                                            </div>
                                            {contextUser && contextAccount ? (
                                                contextAccount.data.admin || members.filter(member => member.userId == contextUser.uid && member.role == 'manager').length == 1 ? (
                                                    <ButtonInput value='Save'/>
                                                ) : (
                                                    <ButtonInput value='Save' badge='requires role' disabled={true}/>
                                                )
                                            ) : (
                                                <ButtonInput value='Save' badge='requires login' disabled={true}/>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <TextInput label='Search user' placeholder='Type name or full email' value={query} change={setQuery} input={setQuery}/>
                                            <div>
                                                <div>
                                                    <label>Matching users</label>
                                                </div>
                                                <div>
                                                    <Table items={users} columns={queriedUserColumns} onClick={handleClick}/>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </form>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D productId={productId} mouse={true}/>
                        </div>
                    </main>
                    <ProductFooter items={items}/>
                </>
            )
        ) : (
            <LoadingView/>
        )
    )
}