import  * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Issue } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { useMilestone, useProduct } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { useMembers, useIssues } from '../../hooks/list'
import { useIssuesComments } from '../../hooks/map'
import { calculateActual } from '../../functions/burndown'
import { IssueManager } from '../../managers/issue'
import { CommentCount } from '../counts/Comments'
import { IssueCount } from '../counts/Issues'
import { PartCount } from '../counts/Parts'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { BurndownChartWidget } from '../widgets/BurndownChart'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { Column, Table } from '../widgets/Table'
import { LoadingView } from './Loading'

import IssueIcon from '/src/images/issue.png'
import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/chart.png'

export const ProductMilestoneIssueView = () => {
    
    const { goBack, replace, push } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId, milestoneId } = useParams<{ productId: string, milestoneId: string }>()

    // QUERIES

    const state = new URLSearchParams(location.search).get('state') || 'open'

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const milestone = useMilestone(milestoneId)
    const issues = useIssues(productId, milestoneId)
    const comments = useIssuesComments(productId, milestoneId)

    // INITIAL STATES

    const initialTotal = issues && issues.length
    const initialActual = milestone && issues && comments && calculateActual(milestone.start, milestone.end, issues, comments)
    
    // STATES

    // - Computations
    const [total, setTotalIssueCount] = useState(initialTotal)
    const [actual, setActualBurndown] = useState(initialActual)

    // - Interactions
    const [active, setActive] = useState<string>('left')

    // EFFECTS

    useEffect(() => {
        if (issues) {
            setTotalIssueCount(issues.length)
        } else {
            setTotalIssueCount(undefined)
        }
    }, [issues])

    useEffect(() => {
        if (milestone && issues && comments) {
            setActualBurndown(calculateActual(milestone.start, milestone.end, issues, comments))
        } else {
            setActualBurndown(undefined)
        }
    }, [milestone, issues, comments])

    // FUNCTIONS

    async function deleteIssue(event: React.UIEvent, issue: Issue) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this issue from this milestone?')) {
            await IssueManager.updateIssue(issue.id, { ...issue, milestoneId: null })
        }
    }

    async function handleClickLink(event: React.UIEvent<HTMLAnchorElement>) {
        event.preventDefault()
        const pathname = event.currentTarget.pathname
        const search = event.currentTarget.search
        await goBack()
        await replace(`/products/${productId}/issues`)
        await push(`${pathname}${search}`)
    }

    async function handleClickIssue(issue: Issue) {
        await goBack()
        await replace(`/products/${productId}/issues`)
        await push(`/products/${productId}/issues/${issue.id}/comments`)
    }
    
    // CONSTANTS

    const columns: Column<Issue>[] = [
        { label: '👤', content: issue => (
            <ProductUserPictureWidget userId={issue.userId} productId={productId} class='icon medium round'/>
        ) },
        { label: 'Label', class: 'left fill', content: issue => (
            issue.label
        ) },
        { label: 'Assignees', class: 'nowrap', content: issue => (
            issue.assigneeIds.map((assignedId) => (
                <ProductUserPictureWidget key={assignedId} userId={assignedId} productId={productId} class='icon medium round'/>
            ))
        ) },
        { label: 'Comments', class: 'center', content: issue => (
            <span className='badge'>
                <CommentCount issueId={issue.id}/>
            </span>
        ) },
        { label: 'Parts', class: 'center', content: issue => (
            <span className='badge'>
                <PartCount issueId={issue.id}/>
            </span>
        ) },
        { label: '🛠️', class: 'center', content: issue => (
            <a onClick={event => deleteIssue(event, issue)}>
                <img src={DeleteIcon} className='icon medium pad'/>
            </a>
        ) }
    ]

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'List view', image: LeftIcon },
        { name: 'right', text: 'Chart view', image: RightIcon }
    ]

    // RETURN

    return (
        (issues && product && milestone) ? (
            product.deleted ? (
                <Redirect to='/'/>
            ) : (
                <>
                    <main className= {`view product-milestone-issue sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='header'>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1 ? (
                                        <NavLink to={`/products/${productId}/milestones/${milestoneId}/settings`} className='button fill gray right'>
                                            <strong>Edit</strong> milestone
                                        </NavLink>
                                    ) : (
                                        <a className='button fill gray right'>
                                            <strong>Edit</strong> milestone <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill gray right'>
                                        <strong>Edit</strong> milestone <span className='badge'>requires login</span>
                                    </a>
                                )}
                                <h1>
                                    {milestone.label}
                                </h1>
                                <p>
                                    <span>Start: </span>    
                                    <em>
                                        {new Date(milestone.start).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit'} )}
                                    </em>
                                    <span> / End: </span>  
                                    <em>
                                        {new Date(milestone.end).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit'} )}
                                    </em>
                                </p>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                        <NavLink to={`/products/${productId}/issues/new/settings?milestone=${milestoneId}`} onClick={handleClickLink} className='button fill green block-when-responsive'>
                                            <strong>New</strong> issue
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green block-when-responsive'>
                                            <strong>New</strong> issue <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill green block-when-responsive'>
                                        <strong>New</strong> issue <span className='badge'>requires login</span>
                                    </a>
                                )}
                                <NavLink to={`/products/${productId}/milestones/${milestoneId}/issues?state=open`} replace={true} className={`button ${state == 'open' ? 'fill' : 'stroke'} blue`}>
                                    <strong>Open</strong> issues <span className='badge'><IssueCount productId={productId} milestoneId={milestoneId} state='open'/></span>
                                </NavLink>
                                <NavLink to={`/products/${productId}/milestones/${milestoneId}/issues?state=closed`} replace={true} className={`button ${state == 'closed' ? 'fill' : 'stroke'} blue`}>
                                    <strong>Closed</strong> issues <span className='badge'><IssueCount productId={productId} milestoneId={milestoneId} state='closed'/></span>
                                </NavLink>
                            </div>
                            { issues.filter(issue => issue.state == state).length == 0 ? (
                                <div className='main center'>
                                    <div>
                                        <img src={IssueIcon}/>
                                        <p>No <strong>{state}</strong> issue found.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='main'>
                                    <Table columns={columns} items={issues.filter(issue => issue.state == state)} onClick={handleClickIssue}/>
                                </div>
                            ) }
                            <LegalFooter/>
                        </div>
                        <div>
                            <BurndownChartWidget start={new Date(milestone.start)} end={new Date(milestone.end)} total={total} actual={actual}/>
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