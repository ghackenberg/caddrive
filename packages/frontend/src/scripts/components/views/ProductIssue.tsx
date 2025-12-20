import { IssueRead } from 'productboard-common'
import { useContext, useState } from 'react'
import { Navigate, NavLink, useLocation, useParams } from 'react-router'
import { IssueClient } from '../../clients/rest/issue.js'
import { AccountContext } from '../../contexts/Account.js'
import { UserContext } from '../../contexts/User.js'
import { pushState } from '../../functions/history.js'
import { useProduct } from '../../hooks/entity.js'
import { useIssues, useMembers } from '../../hooks/list.js'
import { PartCount } from '../counts/Parts.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter.js'
import { MilestoneName } from '../values/MilestoneName.js'
import { ProductUserPicture } from '../values/ProductUserPicture.js'
import { ProductView3D } from '../widgets/ProductView3D.js'
import { Column, Table } from '../widgets/Table.js'
import { LoadingView } from './Loading.js'
import DeleteIcon from '/src/images/delete.png'
import IssueIcon from '/src/images/issue.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/part.png'

export const ProductIssueView = () => {

    // CONTEXTS

    const { contextUser } = useContext(UserContext)
    const { contextAccount } = useContext(AccountContext)

    // LOCATION

    const { hash, search } = useLocation()

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // QUERY

    const state = new URLSearchParams(search).get('state') || 'open'

    // ENTITIES

    const product = useProduct(productId)
    const members = useMembers(productId)
    const issues = useIssues(productId)

    // STATES
    
    // - Interactions
    const [hovered, setHovered] = useState<IssueRead>()

    // FUNCTIONS

    let timeout: NodeJS.Timeout

    function handleMouseOver(issue: IssueRead) {
        setHovered(issue)
        if (timeout !== undefined) {
            clearTimeout(timeout)
            timeout = undefined
        }
    }

    function handleMouseOut() {
        // TODO handle unmount!
        timeout = setTimeout(() => {
            setHovered(undefined)
            timeout = undefined
        }, 0)
    }

    async function deleteIssue(event: React.UIEvent, issue: IssueRead) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this issue?')) {
            await IssueClient.deleteIssue(productId, issue.issueId)    
        }
    }

    // CONSTANTS

    const columns: Column<IssueRead>[] = [
        { label: '🧑', class: 'center', content: issue => (
            <ProductUserPicture userId={issue.userId} productId={productId} class='icon small round'/>
        ) },
        { label: '#', class: 'center nowrap', content: issue => (
            <span className='badge'>
                {issue.number}
            </span>
        ) },
        { label: 'Label', class: 'left fill', content: issue => (
            issue.label
        ) },
        { label: 'Milestone', class: 'center nowrap', content: issue => (
            issue.milestoneId ? (
                <MilestoneName productId={productId} milestoneId={issue.milestoneId} class='badge'/>
            ) : (
                <span className='badge stroke italic'>not scheduled</span>
            )
        ) },
        { label: 'Assignees', class: 'left nowrap assignees', content: issue => (
            issue.assignedUserIds.length > 0 ? (
                issue.assignedUserIds.map((assignedUserId) => (
                    <ProductUserPicture key={assignedUserId} userId={assignedUserId} productId={productId} class='icon small round'/>
                ))
            ) : (
                <span className='badge stroke italic'>not assigned</span>
            )
        ) },
        { label: 'Comments', class: 'center nowrap', content: issue => (
            <span className='badge'>
                {issue.commentCount}
            </span>
        ) },
        { label: 'Parts', class: 'center nowrap', content: issue => (
            <span className='badge'>
                <PartCount productId={productId} issueId={issue.issueId}/>
            </span>
        ) },
        { label: '🛠️', class: 'center', content: issue => (
            <a onClick={event => deleteIssue(event, issue)}>
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
        (product && members && issues) ? (
            product.deleted ? (
                <Navigate to='/'/>
            ) : (
                <>
                    <main className={`view product-issue sidebar ${!hash ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='header'>
                                {contextUser && contextAccount ? (
                                    contextAccount.data.admin || members.filter(member => member.userId == contextUser.uid).length == 1 ? (
                                        <NavLink to={`/products/${productId}/issues/new/settings`} className='button fill green button block-when-responsive'>
                                            <strong>New</strong> issue
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green block-when-responsive'>
                                            <strong>New</strong> issue <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <NavLink to='/auth/email' className='button fill green block-when-responsive'>
                                        <strong>New</strong> issue <span className='badge'>requires login</span>
                                    </NavLink>
                                )}
                                <NavLink to={`/products/${productId}/issues?state=open`} replace={true} className={`button ${state == 'open' ? 'fill' : 'stroke'} blue`}>
                                    <strong>Open</strong> issues <span className='badge'>{ product.openIssueCount }</span>
                                </NavLink>
                                <NavLink to={`/products/${productId}/issues?state=closed`} replace={true} className={`button ${state == 'closed' ? 'fill' : 'stroke'} blue`}>
                                    <strong>Closed</strong> issues <span className='badge'>{ product.closedIssueCount }</span>
                                </NavLink>
                            </div>
                            { issues.filter(issue => issue.state == state).length == 0 ? (
                                <div className='main center'>
                                    <div>
                                        <img src={IssueIcon}/>
                                        <p>No <strong>{state}</strong> issues found.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='main'>
                                    <Table columns={columns} items={issues.filter(issue => issue.state == state)} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={issue => pushState(`/products/${productId}/issues/${issue.issueId}/comments`)}/>
                                </div>
                            ) }
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D productId={productId} issueId={hovered && hovered.issueId} mouse={true}/>
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