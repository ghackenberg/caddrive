import  * as React from 'react'
import { useState, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Milestone } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { useProduct } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { useMilestones, useMembers } from '../../hooks/list'
import { MilestoneManager } from '../../managers/milestone'
import { IssueCount } from '../counts/Issues'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { MilestoneProgressWidget } from '../widgets/MilestoneProgress'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
import { LoadingView } from './Loading'

import MilestoneIcon from '/src/images/milestone.png'
import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/part.png'

export const ProductMilestoneView = () => {

    const { push } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const milestones = useMilestones(productId)
    
    // STATES

    const [active, setActive] = useState<string>('left')
   
    // FUNCTIONS

    async function deleteMilestone(event: React.UIEvent, milestone: Milestone) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this milestone?')) {
            await MilestoneManager.deleteMilestone(milestone.id) 
        }
    }

    // CONSTANTS

    const columns: Column<Milestone>[] = [
        { label: '👤', content: milestone => (
            <ProductUserPictureWidget userId={milestone.userId} productId={productId} class='icon medium round'/>
        ) },
        { label: 'Label', class: 'left fill', content: milestone => (
            milestone.label
        ) },
        { label: 'Start', class: 'nowrap center', content: milestone => (
            new Date(milestone.start).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
        ) },
        { label: 'End', class: 'nowrap center', content: milestone => (
            new Date(milestone.end).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })
        ) },
        { label: 'Open', class: 'center', content: milestone => (
            <IssueCount productId={productId} milestoneId={milestone.id} state='open'/>
        ) },
        { label: 'Closed', class: 'center', content: milestone => (
            <IssueCount productId={productId} milestoneId={milestone.id} state='closed'/>
        ) },
        { label: 'Progress', class: 'center', content: milestone => (
            <MilestoneProgressWidget productId={productId} milestoneId={milestone.id}/>
        ) },
        { label: '🛠️', class: 'center', content: milestone => (
            <a onClick={event => deleteMilestone(event, milestone)}>
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
        (product && members && milestones) ? (
            product.deleted ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className={`view product-milestone sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='header'>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1 ? (
                                        <NavLink to={`/products/${productId}/milestones/new/settings`} className='button fill green'>
                                            <strong>New</strong> milestone
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green'>
                                            <strong>New</strong> milestone <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill green'>
                                        <strong>New</strong> milestone <span className='badge'>requires login</span>
                                    </a>
                                )}
                            </div>
                            { milestones.length == 0 ? (
                                <div className='main center'>
                                    <div>
                                        <img src={MilestoneIcon}/>
                                        <p>No milestones found.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='main'>
                                    <Table columns={columns} items={milestones} onClick={milestone => push(`/products/${productId}/milestones/${milestone.id}/issues`)}/>
                                </div>
                            ) }
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