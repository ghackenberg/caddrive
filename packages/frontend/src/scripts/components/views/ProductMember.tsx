import  * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Redirect } from 'react-router'
// Commons
import { Member, Product, User } from 'productboard-common'
// Managers
import { ProductManager } from '../../managers/product'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
import { MemberManager } from '../../managers/member'
// Images
import * as DeleteIcon from '/src/images/delete.png'
import { UserManager } from '../../managers/user'
import { ProductFooter } from '../snippets/ProductFooter'

export const ProductMemberView = (props: RouteComponentProps<{product: string}>) => {

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
                for (var index = 0; index < members.length; index++) {
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
                    <img src={`/rest/files/${users[member.id].pictureId}.jpg`} className='big' />
              </Link> 
            ) : '?'
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
                                    <ProductView3D product={product} mouse={true} vr= {true}/>
                                </div>
                            </main>
                            <ProductFooter sidebar={sidebar} setSidebar={setSidebar} item1={{'text':'Members','image':'user'}} item2={{'text':'3D-Modell','image':'part'}}></ProductFooter>
                        </Fragment>
                    )}
                 </Fragment>    
            )}
        </main>
    )
}