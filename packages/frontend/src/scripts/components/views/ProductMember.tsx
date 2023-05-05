import  * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Member, Product, User } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'
import LoadIcon from '/src/images/load.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/part.png'

export const ProductMemberView = () => {

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // INITIAL STATES

    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMembers = productId == 'new' ? undefined : MemberManager.findMembersFromCache(productId)
    const initialUsers : {[id: string]: User} = {}
    for (const member of initialMembers || []) {
        const user = UserManager.getUserFromCache(member.userId)
        if (user) {
            initialUsers[member.id] = user
        }
    }
    
    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [users, setUsers] = useState<{[id: string]: User}>(initialUsers)
    // - Interactions
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
        if (members) {
            Promise.all(members.map(member => UserManager.getUser(member.userId))).then(memberUsers => {
                if (exec) {
                    const newUsers = {...users}
                    for (let index = 0; index < members.length; index++) {
                        newUsers[members[index].id] = memberUsers[index]
                    }
                    setUsers(newUsers)
                }
            })
        }
        return () => { exec = false }
    }, [members])

    // FUNCTIONS

    async function deleteMember(member:Member) {
        // TODO handle unmount!
        if (confirm('Do you really want to delete this member?')) {
            await MemberManager.deleteMember(member.id)
            setMembers(members.filter(other => other.id != member.id))  
        }
    }

    // CONSTANTS

    const columns: Column<Member>[] = [
        { label: '👤', content: member => (
            member.id in users ? (
                <NavLink to={`/products/${productId}/members/${member.id}/settings`}>
                    <ProductUserPictureWidget user={users[member.id]} members={members} class='icon medium round middle'/>
                </NavLink> 
            ) : (
                <img src={LoadIcon} className='icon medium pad animation spin'/>
            )
        ) },
        { label: 'Name', class: 'left nowrap', content: (
            member => member.id in users ? (
                <NavLink to={`/products/${productId}/members/${member.id}/settings`}>
                    {users[member.id].name}
                </NavLink>
             ) : '?'
        ) },
        { label: 'Role', class: 'fill left nowrap', content: (
            member => member.id in users ? (
                <NavLink to={`/products/${productId}/members/${member.id}/settings`}>
                    {member.role}
                </NavLink>
             ) : '?'
        ) },
        { label: '🛠️', class: 'center', content: member => (
            <a onClick={() => deleteMember(member)}>
                <img src={DeleteIcon} className='icon medium pad'/>
            </a>
        ) }
    ]

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'List view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        (product && members) ? (
            product.deleted ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className={`view product-member sidebar ${active == 'left' ? 'hidden' : 'visible'}` }>
                        <div>
                            <div>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1 ? (
                                        <NavLink to={`/products/${productId}/members/new/settings`} className='button fill green'>
                                            New member
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green' style={{fontStyle: 'italic'}}>
                                            New member (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill green' style={{fontStyle: 'italic'}}>
                                        New member (requires login)
                                    </a>
                                )}
                                <Table columns={columns} items={members}/>
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