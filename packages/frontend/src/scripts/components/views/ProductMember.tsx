import  * as React from 'react'
import { useState, useEffect, Fragment, useContext } from 'react'
import { Redirect } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'

import { Member, Product, User } from 'productboard-common'

import { VersionContext } from '../../contexts/Version'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { ProductFooter } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'

import * as DeleteIcon from '/src/images/delete.png'
import * as LoadIcon from '/src/images/load.png'

export const ProductMemberView = (props: RouteComponentProps<{product: string}>) => {

    // CONTEXTS

    const contextVersion = useContext(VersionContext)

    // PARAMS

    const productId = props.match.params.product

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
    const [sidebar, setSidebar] = useState<boolean>(false)

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
        { label: 'Picture', content: member => (
            member.id in users ? (
                <Link to={`/products/${productId}/members/${member.id}/settings`}>
                    <img src={`/rest/files/${users[member.id].pictureId}.jpg`} className='big'/>
              </Link> 
            ) : <a> <img src={LoadIcon} className='big load' /> </a>
        )},
        { label: 'User', class: 'left nowrap', content: (
            member => member.id in users ? (
                <Link to={`/products/${productId}/members/${member.id}/settings`}>
                    {users[member.id].name}
                </Link>
             ) : '?'
        )},
        { label: 'Role', class: 'fill left nowrap', content: (
            member => member.id in users ? (
                <Link to={`/products/${productId}/members/${member.id}/settings`}>
                    {member.role}
                </Link>
             ) : '?'
        )},
        { label: '', class: 'center', content: member => (
            <a onClick={() => deleteMember(member)}><img src={DeleteIcon} className='small'/> </a>
        )}
    ]

    // RETURN

    return (
        <main className="view extended members">
            { product && (
                 <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className={`sidebar ${sidebar ? 'visible' : 'hidden'}` }>
                                <div>
                                <Link to={`/products/${productId}/members/new/settings`} className='button green fill'>
                                        New member
                                </Link>
                                    
                                   { members && <Table columns={columns} items={members}/> }
                                </div>
                                <div>
                                <ProductView3D product={product} version={contextVersion.id != undefined ? contextVersion : null} mouse={true} vr= {true} change = {contextVersion.update}/>
                                </div>
                            </main>
                            <ProductFooter 
                                item1={{'text':'Members','image':'user', 'sidebar': sidebar , 'setSidebar': setSidebar, 'set': false }} 
                                item2={{'text':'3D model','image':'part', 'sidebar': sidebar, 'setSidebar': setSidebar, 'set': true }} 
                            />
                        </Fragment>
                    )}
                 </Fragment>    
            )}
        </main>
    )
}