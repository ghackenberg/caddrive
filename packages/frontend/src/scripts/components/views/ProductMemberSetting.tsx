import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent, useContext } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { Member, MemberRole, Product, User } from 'productboard-common'

import { VersionContext } from '../../contexts/Version'
import { TextInput } from '../inputs/TextInput'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { ProductFooter } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { Column, Table } from '../widgets/Table'
import { ProductView3D } from '../widgets/ProductView3D'
import { UserPictureWidget } from '../widgets/UserPicture'

import * as DeleteIcon from '/src/images/delete.png'

const ROLES: MemberRole[] = ['manager', 'engineer', 'customer']

export const ProductMemberSettingView = (props: RouteComponentProps<{product: string, member: string}>) => {
    
    const { goBack } = useHistory()

    // CONTEXTS

    const contextVersion = useContext(VersionContext)

    // PARAMS

    const productId = props.match.params.product
    const memberId = props.match.params.member

    // INITIAL STATES

    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMember = memberId == 'new' ? undefined : MemberManager.getMemberFromCache(memberId)
    const initialUser = initialMember ? UserManager.getUserFromCache(initialMember.userId) : undefined
    const initialRole = initialMember ? initialMember.role : 'customer'

    // STATES
    
    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [users, setUsers] = useState<User[]>()
    const [user, setUser] = useState<User>(initialUser)
    const [member, setMember] = useState<Member>(initialMember)
    // - Computations
    const [names, setNames] = useState<React.ReactNode[]>()
    // - Values
    const [role, setRole] = useState<MemberRole>(initialRole)
    // - Interactions
    const [query, setQuery] = useState<string>('')
    const [sidebar, setSidebar] = useState<boolean>(false)

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { UserManager.findUsers(query, productId).then(setUsers) }, [props, query])
    useEffect(() => { memberId != 'new' && MemberManager.getMember(memberId).then(setMember) }, [props])
    useEffect(() => { member && UserManager.getUser(member.userId).then(setUser) }, [member] )
    useEffect(() => { member && setRole(member.role) }, [member] )

    // - Computations
    useEffect(() => {
        if (users) {
            setNames(users.map(user => {
                const index = user.name.toLowerCase().indexOf(query.toLowerCase())
                const before = user.name.substring(0, index)
                const between = user.name.substring(index, index + query.length)
                const after = user.name.substring(index + query.length)
                return <Fragment>{before}<mark>{between}</mark>{after}</Fragment>
            }))
        }
    }, [users])

    // FUNCTIONS

    async function submitMember(event: FormEvent) {
        event.preventDefault()
        if (memberId == 'new') {
            if (confirm('Do you really want to add this member?')) {
                    await MemberManager.addMember({ productId, userId: user.id, role: role })
                    setUser(null)           
            }
        }
        if (memberId != 'new') {
            if (confirm('Do you really want to change this member?')) {
                await MemberManager.updateMember(memberId,{...member, role: role})
                goBack()       
            }
        }
    
    }

    function selectUser(user: User) {
        setQuery('')
        setUser(user)
    }

    // CONSTANTS

    const selectedUserColumns: Column<User>[] = [
        { label: 'Picture', class: 'center', content: user => (
            <a >
                <UserPictureWidget user={user} class='big'/>
            </a>
        ) },
        { label: 'Name', class: 'left fill', content: user => (
            <a>
                {user ? user.name : '?'}
            </a>
        ) },
        { label: '', class: 'center', content: () => (
            memberId == 'new' && (
                <a onClick={() => setUser(null)}>
                    <img src={DeleteIcon} className='small'/>
                </a>
            )
        ) }
    ]

    const queriedUserColumns: Column<User>[] = [
        { label: 'Picture', class: 'center', content: user => (
            <a onClick={() => selectUser(user)}>
                <UserPictureWidget user={user} class='big'/>
            </a>
        ) },
        { label: 'Name', class: 'left fill', content: (user, index) => (
            <a onClick={() => selectUser(user)}>
                {names ? names[index] : '?'}
            </a>
        ) }
    ]
    
    // RETURN

    return (
        <main className="view extended member">
            {product && (
                 <Fragment>
                    {product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className={`sidebar ${sidebar ? 'visible' : 'hidden'}`}>
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submitMember}>
                                        {user ? (
                                            <div>
                                                <div>
                                                    User:
                                                </div>
                                                <div>
                                                    {users && user && (
                                                        <Table items={[user]} columns={selectedUserColumns}/>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <TextInput label='Query' placeholder='Type query' value={query} change={setQuery} input={setQuery}/>
                                        )}
                                        {query && (
                                                <div>
                                                    <div>
                                                        Users:
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
                                                    Role:
                                                </div>
                                                <div>
                                                    <select value={role} onChange={(event) => setRole(event.currentTarget.value as MemberRole)}> 
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
                                            <div>
                                                <div/>
                                                <div>
                                                    <input type='submit' value='Save'/>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </div>
                                <div>
                                    <ProductView3D product={product} version={contextVersion.id != undefined ? contextVersion : null} mouse={true} vr={true} change={contextVersion.update}/>
                                </div>
                            </main>
                            <ProductFooter 
                                item1={{ text: 'Member settings', image:'setting', sidebar , setSidebar, set: false }} 
                                item2={{ text: '3D model', image:'part', sidebar, setSidebar, set: true }} 
                            />                   
                        </Fragment>
                    )}
                 </Fragment>
            )}
        </main>
    )
}