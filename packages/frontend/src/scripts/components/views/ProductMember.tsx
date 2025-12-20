import { MemberRead } from 'productboard-common'
import { useContext } from 'react'
import { Navigate, NavLink, useLocation, useParams } from 'react-router'
import { MemberClient } from '../../clients/rest/member.js'
import { AccountContext } from '../../contexts/Account.js'
import { UserContext } from '../../contexts/User.js'
import { pushState } from '../../functions/history.js'
import { useProduct } from '../../hooks/entity.js'
import { useMembers } from '../../hooks/list.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter.js'
import { ProductUserName } from '../values/ProductUserName.js'
import { ProductUserPicture } from '../values/ProductUserPicture.js'
import { ProductView3D } from '../widgets/ProductView3D.js'
import { Column, Table } from '../widgets/Table.js'
import { LoadingView } from './Loading.js'
import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/part.png'
import MemberIcon from '/src/images/user.png'

export const ProductMemberView = () => {

    // CONTEXTS

    const { contextUser } = useContext(UserContext)
    const { contextAccount } = useContext(AccountContext)

    // LOCATION

    const { hash } = useLocation()

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // ENTITIES

    const product = useProduct(productId)
    const members = useMembers(productId)

    // FUNCTIONS

    async function deleteMember(event: React.UIEvent, member: MemberRead) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this member?')) {
            await MemberClient.deleteMember(productId, member.memberId)
        }
    }

    // CONSTANTS

    const columns: Column<MemberRead>[] = [
        { label: '👤', content: member => (
            <ProductUserPicture userId={member.userId} productId={productId} class='icon medium round middle'/>
        ) },
        { label: 'Name', class: 'left nowrap', content: member => (
            <ProductUserName userId={member.userId} productId={productId}/>
        ) },
        { label: 'Role', class: 'fill left nowrap', content: member => (
            <span className={`badge role ${member.role}`}>{member.role}</span>
        ) },
        { label: '🛠️', class: 'center', content: member => (
            <a onClick={event => deleteMember(event, member)}>
                <img src={DeleteIcon} className='icon medium pad'/>
            </a>
        ) }
    ]

    const items: ProductFooterItem[] = [
        { text: 'List view', image: LeftIcon, hash: '' },
        { text: 'Model view', image: RightIcon, hash: '#model' }
    ]

    // RETURN

    return (
        (product && members) ? (
            product.deleted ? (
                <Navigate to='/'/>
            ) : (
                <>
                    <main className={`view product-member sidebar ${!hash ? 'hidden' : 'visible'}` }>
                        <div>
                            <div className='header'>
                                {contextUser && contextAccount ? (
                                    contextAccount.data.admin || members.filter(member => member.userId == contextUser.uid && member.role == 'manager').length == 1 ? (
                                        <NavLink to={`/products/${productId}/members/new/settings`} className='button fill green'>
                                            <strong>New</strong> member
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green'>
                                            <strong>New</strong> member <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <NavLink to='/auth/email' className='button fill green'>
                                        <strong>New</strong> member <span className='badge'>requires login</span>
                                    </NavLink>
                                )}
                            </div>
                            { members.length == 0 ? (
                                <div className='main center'>
                                    <div>
                                        <img src={MemberIcon}/>
                                        <p>No members found.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='main'>
                                    <Table columns={columns} items={members} onClick={member => pushState(`/products/${productId}/members/${member.memberId}/settings`)}/>
                                </div>
                            ) }
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