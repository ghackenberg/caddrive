import  * as React from 'react'
import { useState, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Tag } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { useProduct } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { useMembers, useTags } from '../../hooks/list'
import { TagManager } from '../../managers/tag'
import { TagAssignmentCount } from '../counts/TagAssignments'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
import { TagWidget } from '../widgets/Tag'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/part.png'

export const ProductTagView = () => {

    const { push } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const tags = useTags(productId)
    
    // STATES

    const [active, setActive] = useState<string>('left')

    // FUNCTIONS

    async function deleteTag(event: React.UIEvent, tag: Tag) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this member?')) {
            await TagManager.deleteTag(tag.id)
        }

    }

    // CONSTANTS

    const columns: Column<Tag>[] = [
        { label: 'tag', class: 'left nowrap', content: tag => (
            <TagWidget tagId={tag.id} ></TagWidget>
        ) },
        { label: 'description', class: 'left nowrap', content: tag => (
            <div>{tag.description ? tag.description : ''} </div>
        ) },
        { label: 'assignments', class: 'left nowrap', content: tag => (
            <TagAssignmentCount productId={productId} tagId={tag.id}></TagAssignmentCount>
        ) },
        { label: '🛠️', class: 'center', content: tag => (
            <a onClick={event => deleteTag(event, tag)}>
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
                                        <NavLink to={`/products/${productId}/tags/new/settings`} className='button fill green'>
                                            New tag
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green' style={{fontStyle: 'italic'}}>
                                            New tag (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill green' style={{fontStyle: 'italic'}}>
                                        New tag (requires login)
                                    </a>
                                )}
                                <Table columns={columns} items={tags} onClick={tag => push(`/products/${productId}/tags/${tag.id}/settings`)}/>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D productId={productId} mouse={true}/>
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