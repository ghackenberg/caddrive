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

export const ProductMemberView = (props: RouteComponentProps<{product: string}>) => {

    // PARAMS

    const productId = props.match.params.product

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>()
    const [members, setMember] = useState<Member[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMember) }, [props])
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
            setMember(members.filter(other => other.id != member.id))  
        }
    }

    // CONSTANTS

    const columns: Column<Member>[] = [
        { label: 'Picture', content: member => (
            member.id in users ? <img src={`/rest/files/${users[member.id].pictureId}.jpg`} className='big' /> : '?'
        )},
        { label: 'User', class: 'fill left nowrap', content: (
            member => member.id in users ? users[member.id].name : '?'
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
                            <main className="sidebar">
                                <div>
                                <Link to={`/products/${productId}/members/new/settings`}>
                                        New member
                                </Link>
                                    
                                   { members && <Table columns={columns} items={members}/> }
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