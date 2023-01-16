import  * as React from 'react'
import { useState, useEffect, Fragment, useContext } from 'react'
import { Redirect } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'

import { Member, Product, User } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'

import * as DeleteIcon from '/src/images/delete.png'
import * as LoadIcon from '/src/images/load.png'
import * as LeftIcon from '/src/images/list.png'
import * as RightIcon from '/src/images/part.png'

export const ProductMemberView = (props: RouteComponentProps<{product: string}>) => {

    // PARAMS

    const productId = props.match.params.product

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
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMembers) }, [props])
    useEffect(() => {
        if (members) {
            Promise.all(members.map(member => UserManager.getUser(member.userId))).then(memberUsers => {
                const newUsers = {...users}
                for (let index = 0; index < members.length; index++) {
                    newUsers[members[index].id] = memberUsers[index]
                }
                setUsers(newUsers)
            })
        }
    }, [members])

    // FUNCTIONS

    async function deleteMember(member:Member) {
        if (confirm('Do you really want to delete this member?')) {
            await MemberManager.deleteMember(member.id)
            setMembers(members.filter(other => other.id != member.id))  
        }
    }

    // CONSTANTS

    const columns: Column<Member>[] = [
        { label: '👤', content: member => (
            member.id in users ? (
                <Link to={`/products/${productId}/members/${member.id}/settings`}>
                    <ProductUserPictureWidget user={users[member.id]} members={members} class='icon medium round middle'/>
                </Link> 
            ) : (
                <img src={LoadIcon} className='icon medium pad animation spin'/>
            )
        ) },
        { label: 'Name', class: 'left nowrap', content: (
            member => member.id in users ? (
                <Link to={`/products/${productId}/members/${member.id}/settings`}>
                    {users[member.id].name}
                </Link>
             ) : '?'
        ) },
        { label: 'Role', class: 'fill left nowrap', content: (
            member => member.id in users ? (
                <Link to={`/products/${productId}/members/${member.id}/settings`}>
                    {member.role}
                </Link>
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
        <main className="view extended product-member">
            {product && (
                 <Fragment>
                    {product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className={`sidebar ${active == 'left' ? 'hidden' : 'visible'}` }>
                                <div>
                                    {contextUser ? (
                                        members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1 ? (
                                            <Link to={`/products/${productId}/members/new/settings`} className='button fill green'>
                                                New member
                                            </Link>
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
                                    {members && (
                                        <Table columns={columns} items={members}/>
                                    )}
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true} vr={true}/>
                                </div>
                            </main>
                            <ProductFooter items={items} active={active} setActive={setActive}/>
                        </Fragment>
                    )}
                 </Fragment>    
            )}
        </main>
    )
}