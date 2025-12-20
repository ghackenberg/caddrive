import { MilestoneRead } from 'productboard-common'
import { useContext } from 'react'
import { Navigate, NavLink, useLocation, useParams } from 'react-router'
import { MilestoneClient } from '../../clients/rest/milestone.js'
import { AccountContext } from '../../contexts/Account.js'
import { UserContext } from '../../contexts/User.js'
import { pushState } from '../../functions/history.js'
import { formatDateHourMinute } from '../../functions/time.js'
import { useProduct } from '../../hooks/entity.js'
import { useMembers, useMilestones } from '../../hooks/list.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter.js'
import { ProductUserPicture } from '../values/ProductUserPicture.js'
import { MilestoneProgressWidget } from '../widgets/MilestoneProgress.js'
import { ProductView3D } from '../widgets/ProductView3D.js'
import { Column, Table } from '../widgets/Table.js'
import { LoadingView } from './Loading.js'
import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import MilestoneIcon from '/src/images/milestone.png'
import RightIcon from '/src/images/part.png'

export const ProductMilestoneView = () => {

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
    const milestones = useMilestones(productId)
   
    // FUNCTIONS

    async function deleteMilestone(event: React.UIEvent, milestone: MilestoneRead) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this milestone?')) {
            await MilestoneClient.deleteMilestone(productId, milestone.milestoneId) 
        }
    }

    // CONSTANTS

    const columns: Column<MilestoneRead>[] = [
        { label: '🧑', content: milestone => (
            <ProductUserPicture userId={milestone.userId} productId={productId} class='icon small round'/>
        ) },
        { label: 'Label', class: 'left fill', content: milestone => (
            milestone.label
        ) },
        { label: 'Start', class: 'nowrap center', content: milestone => (
            <span className='badge stroke'>
                {formatDateHourMinute(new Date(milestone.start))}
            </span>
        ) },
        { label: 'End', class: 'nowrap center', content: milestone => (
            <span className='badge stroke'>
                {formatDateHourMinute(new Date(milestone.end))}
            </span>
        ) },
        { label: 'Open', class: 'center', content: milestone => (
            <span className='badge'>
                {milestone.openIssueCount}
            </span>
        ) },
        { label: 'Closed', class: 'center', content: milestone => (
            <span className='badge'>
                {milestone.closedIssueCount}
            </span>
        ) },
        { label: 'Progress', class: 'center', content: milestone => (
            <MilestoneProgressWidget milestone={milestone}/>
        ) },
        { label: '🛠️', class: 'center', content: milestone => (
            <a onClick={event => deleteMilestone(event, milestone)}>
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
        (product && members && milestones) ? (
            product.deleted ? (
                <Navigate to='/'/>
            ) : (
                <>
                    <main className={`view product-milestone sidebar ${!hash ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='header'>
                                {contextUser && contextAccount ? (
                                    contextAccount.data.admin || members.filter(member => member.userId == contextUser.uid && member.role == 'manager').length == 1 ? (
                                        <NavLink to={`/products/${productId}/milestones/new/settings`} className='button fill green'>
                                            <strong>New</strong> milestone
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green'>
                                            <strong>New</strong> milestone <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <NavLink to='/auth/email' className='button fill green'>
                                        <strong>New</strong> milestone <span className='badge'>requires login</span>
                                    </NavLink>
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
                                    <Table columns={columns} items={milestones} onClick={milestone => pushState(`/products/${productId}/milestones/${milestone.milestoneId}/issues`)}/>
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