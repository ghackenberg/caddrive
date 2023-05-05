import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent, useContext } from 'react'
import { Redirect, useParams } from 'react-router'

import { Member, MemberRole, Product, User } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { useAsyncHistory } from '../../hooks/history'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { Column, Table } from '../widgets/Table'
import { ProductView3D } from '../widgets/ProductView3D'
import { UserPictureWidget } from '../widgets/UserPicture'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/setting.png'
import RightIcon from '/src/images/part.png'

const ROLES: MemberRole[] = ['manager', 'engineer', 'customer']

export const ProductMemberSettingView = () => {
    
    const { goBack } = useAsyncHistory()

    // PARAMS

    const { productId, memberId } = useParams<{ productId: string, memberId: string }>()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // INITIAL STATES

    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMembers = productId == 'new' ? [] : MemberManager.findMembersFromCache(productId)
    const initialMember = memberId == 'new' ? undefined : MemberManager.getMemberFromCache(memberId)
    const initialUser = initialMember ? UserManager.getUserFromCache(initialMember.userId) : undefined
    const initialRole = initialMember ? initialMember.role : 'customer'

    // STATES
    
    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [users, setUsers] = useState<User[]>()
    const [user, setUser] = useState<User>(initialUser)
    const [member, setMember] = useState<Member>(initialMember)
    // - Computations
    const [names, setNames] = useState<React.ReactNode[]>()
    // - Values
    const [role, setRole] = useState<MemberRole>(initialRole)
    // - Interactions
    const [query, setQuery] = useState<string>('')
    const [active, setActive] = useState<string>('left')

    // EFFECTS

    // - Entities
    useEffect(() => {
        let exec = true
        ProductManager.getProduct(productId).then(product => exec && setProduct(product))
        return () => { exec = false }
    }, [productId])
    useEffect(() => {
        let exec = true
        MemberManager.findMembers(productId).then(members => exec && setMembers(members))
        return () => { exec = false }
    }, [productId])
    useEffect(() => {
        let exec = true
        UserManager.findUsers(query, productId).then(users => exec && setUsers(users))
        return () => { exec = false }
    }, [productId, query])
    useEffect(() => {
        let exec = true
        memberId != 'new' && MemberManager.getMember(memberId).then(member => exec && setMember(member))
        return () => { exec = false }
    }, [memberId])
    useEffect(() => {
        let exec = true
        member && UserManager.getUser(member.userId).then(user => exec && setUser(user))
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
                await MemberManager.addMember({ productId, userId: user.id, role: role })
                await goBack()
            }
        } else {
            if (confirm('Do you really want to change this member?')) {
                await MemberManager.updateMember(memberId,{...member, role: role})
                await goBack()
            }
        }
    }

    function selectUser(user: User) {
        setQuery('')
        setUser(user)
    }

    // CONSTANTS

    const selectedUserColumns: Column<User>[] = [
        { label: '👤', class: 'center', content: user => (
            <UserPictureWidget user={user} class='icon medium round'/>
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

    const queriedUserColumns: Column<User>[] = [
        { label: '👤', class: 'center', content: user => (
            <a onClick={() => selectUser(user)}>
                <UserPictureWidget user={user} class='icon medium round'/>
            </a>
        ) },
        { label: 'Name', class: 'left fill', content: (user, index) => (
            <a onClick={() => selectUser(user)}>
                {names ? names[index] : '?'}
            </a>
        ) }
    ]

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Form view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]
    
    // RETURN

    return (
        (product && members) ? (
            product.deleted ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className={`view product-member-setting sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div>
                                <h1>{memberId == 'new' ? 'New member' : 'Member settings'}</h1>
                                <form onSubmit={onSubmit}>
                                    {user ? (
                                        <div>
                                            <div>
                                                <label>User</label>
                                            </div>
                                            <div>
                                                {users && user && (
                                                    <Table items={[user]} columns={selectedUserColumns}/>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <TextInput label='Search user' placeholder='Type name or full email' value={query} change={setQuery} input={setQuery}/>
                                    )}
                                    {query && (
                                            <div>
                                                <div>
                                                    <label>Matching users</label>
                                                </div>
                                                <div>
                                                    {users && (
                                                        <Table items={users} columns={queriedUserColumns}/>
                                                    )}
                                                </div>
                                            </div>
                                    )}
                                    {user && (
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
                                    )}
                                    {user && (
                                        contextUser ? (
                                            members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1 ? (
                                                <SubmitInput value='Save'/>
                                            ) : (
                                                <SubmitInput value='Save (requires role)' disabled={true}/>
                                            )
                                        ) : (
                                            <SubmitInput value='Save (requires login)' disabled={true}/>
                                        )
                                    )}
                                </form>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D product={product} mouse={true}/>
                        </div>
                    </main>
                    <ProductFooter items={items} active={active} setActive={setActive}/>       
                </>
            )
        ) : (
            <LoadingView/>
        )
    )
}