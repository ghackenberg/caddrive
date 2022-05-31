import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Redirect, useHistory } from 'react-router'
// Commons
import { Member, MemberRole, Product, User } from 'productboard-common'
// Managers
import { ProductManager } from '../../managers/product'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ProductView3D } from '../widgets/ProductView3D'
import { TextInput } from '../inputs/TextInput'
import { UserManager } from '../../managers/user'
import { MemberManager } from '../../managers/member'
import { Column, Table } from '../widgets/Table'
// Images
import * as DeleteIcon from '/src/images/delete.png'


export const ProductMemberSettingView = (props: RouteComponentProps<{product: string, member: string}>) => {
    
    const history = useHistory()
    const roles: MemberRole[] = ['manager', 'engineer', 'customer']

    // PARAMS

    const productId = props.match.params.product
    const memberId = props.match.params.member
    
    // STATES
    
    // - Entities
    const [product, setProduct] = useState<Product>()
    const [users, setUsers] = useState<User[]>()
    const [selectedUser, setSelectedUser] = useState<User>()
    const [member, setMember] = useState<Member>()
    // - Computations
    const [names, setNames] = useState<React.ReactNode[]>()
    // - Values
    const [role, setRole] = useState<MemberRole>('customer')
    // - Interactions
    const [query, setQuery] = useState<string>('')
    
    // EFFECTS
   
    
    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { UserManager.findUsers(query, productId).then(setUsers) }, [props, query])
    useEffect(() => { memberId != 'new' && MemberManager.getMember(memberId).then(setMember) }, [props])
    useEffect(() => { member && UserManager.getUser(member.userId).then(setSelectedUser) }, [member] )
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
                    await MemberManager.addMember({ productId, userId: selectedUser.id, role: role })
                    setSelectedUser(null)           
            }
        }
        if (memberId != 'new') {
            if (confirm('Do you really want to change this member?')) {
                await MemberManager.updateMember(memberId,{...member, role: role})
                history.goBack()       
            }
        }
    
    }

    function selectUser(user: User) {
        setQuery('')
        setSelectedUser(user)
    }

    // CONSTANTS

    const columns1: Column<User>[] = [
        { label: 'Picture', class: 'center', content: () => (
            <a >
                <img src={`/rest/files/${selectedUser.id}.jpg`} className='big'/>        
            </a>
        )},
        { label: 'Name', class: 'left fill', content: () => (
            <a>
                {selectedUser ? selectedUser.name : '?'}
            </a>
        )},
        { label: '', class: 'center', content: () => (
            memberId == 'new' && <a onClick={() => setSelectedUser(null)}><img src={DeleteIcon} className='small'/> </a>
        )}
    ]

    const columns: Column<User>[] = [
        { label: 'Picture', class: 'center', content: user => (
            <a onClick={() => selectUser(user)}>
                <img src={`/rest/files/${user.id}.jpg`} className='big'/>
            </a>
        )},
        { label: 'Name', class: 'left fill', content: (user, index) => (
            <a onClick={() => selectUser(user)}>
                {names ? names[index] : '?'}
            </a>
        )}
    ]

   

    // RETURN

    return (
        <main className="view extended member">
            { product && (
                 <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submitMember}>
                                        { selectedUser ? 
                                        <div>
                                            <div>
                                                User:
                                            </div>
                                            <div>
                                                { users && selectedUser && <Table items={users.slice(0,1)} columns={columns1}/> }
                                            </div>
                                        </div>
                                        : <TextInput label='Query' placeholder='Type query' value={query} change={setQuery} input={setQuery}/>
                                        } { query && (
                                                <div>
                                                    <div>
                                                        Users:
                                                    </div>
                                                    <div>
                                                        { users && <Table items={users} columns={columns}/> }
                                                    </div>
                                                </div>
                                        )} { selectedUser && (
                                            <div>
                                                <div>
                                                    Role:
                                                </div>
                                                <div>
                                                    <select value={role} onChange={(event) => setRole(event.currentTarget.value as MemberRole)}> 
                                                        {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                                                        
                                                    </select>
                                                </div>
                                            </div>
                                        )} { selectedUser && (
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
                                    <ProductView3D product={product} mouse={true} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>
            )}
        </main>
    )
}