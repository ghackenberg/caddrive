import  * as React from 'react'
import { useState, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Milestone } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { useMilestones, useProduct, useMembers } from '../../hooks/route'
import { MilestoneManager } from '../../managers/milestone'
import { IssueCount } from '../counts/Issues'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { MilestoneProgressWidget } from '../widgets/MilestoneProgress'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/part.png'

export const ProductMilestoneView = () => {

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

    async function deleteMilestone(milestone: Milestone) {
        // TODO handle unmount!
        if (confirm('Do you really want to delete this milestone?')) {
            await MilestoneManager.deleteMilestone(milestone.id) 
        }
    }

    // CONSTANTS

    const columns: Column<Milestone>[] = [
        { label: '👤', content: milestone => (
            <NavLink to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                <ProductUserPictureWidget userId={milestone.userId} productId={productId} class='icon medium round'/>
            </NavLink>
        ) },
        { label: 'Label', class: 'left fill', content: milestone => (
            <NavLink to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {milestone.label}
            </NavLink>
        ) },
        { label: 'Start', class: 'nowrap center', content: milestone => (
            <NavLink to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {new Date(milestone.start).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </NavLink>
        ) },
        { label: 'End', class: 'nowrap center', content: milestone => (
            <NavLink to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                {new Date(milestone.end).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </NavLink>
        ) },
        { label: 'Open', class: 'center', content: milestone => (
            <NavLink to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                <IssueCount productId={productId} milestoneId={milestone.id} state='open'/>
            </NavLink>
        ) },
        { label: 'Closed', class: 'center', content: milestone => (
            <NavLink to={`/products/${productId}/milestones/${milestone.id}/issues`}>
                <IssueCount productId={productId} milestoneId={milestone.id} state='closed'/>
            </NavLink>
        ) },
        { label: 'Progress', class: 'center', content: milestone => (
            <MilestoneProgressWidget productId={productId} milestoneId={milestone.id}/>
        ) },
        { label: '🛠️', class: 'center', content: milestone => (
            <a onClick={() => deleteMilestone(milestone)}>
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
                            <div>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1 ? (
                                        <NavLink to={`/products/${productId}/milestones/new/settings`} className='button fill green'>
                                            New milestone
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green' style={{fontStyle: 'italic'}}>
                                            New milestone (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill green' style={{fontStyle: 'italic'}}>
                                        New milestone (requires login)
                                    </a>
                                )}
                                <Table columns={columns} items={milestones}/>
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