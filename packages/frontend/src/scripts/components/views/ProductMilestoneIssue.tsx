import  * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { IssueRead } from 'productboard-common'

import { IssueClient } from '../../clients/rest/issue'
import { UserContext } from '../../contexts/User'
import { useMilestone, useProduct } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { useMembers, useIssues } from '../../hooks/list'
import { useIssuesComments } from '../../hooks/map'
import { calculateActual } from '../../functions/burndown'
import { formatDateHourMinute } from '../../functions/time'
import { PartCount } from '../counts/Parts'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { BurndownChartWidget } from '../widgets/BurndownChart'
import { ProductUserName } from '../values/ProductUserName'
import { ProductUserPicture } from '../values/ProductUserPicture'
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
    const milestone = useMilestone(productId, milestoneId)
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
        function updateActualBurndown() {
            setActualBurndown(milestone && issues && comments && calculateActual(milestone.start, milestone.end, issues, comments))
        }
        let interval: NodeJS.Timer
        const timeout = setTimeout(() => {
            interval = setInterval(updateActualBurndown, 1000)
            updateActualBurndown()
        }, 1000 - Date.now() % 1000)
        return () => {
            clearTimeout(timeout)
            interval && clearInterval(interval)
        }
    })

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

    async function deleteIssue(event: React.UIEvent, issue: IssueRead) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this issue from this milestone?')) {
            await IssueClient.updateIssue(productId, issue.issueId, { ...issue, milestoneId: null })
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

    async function handleClickIssue(issue: IssueRead) {
        await goBack()
        await replace(`/products/${productId}/issues`)
        await push(`/products/${productId}/issues/${issue.issueId}/comments`)
    }
    
    // CONSTANTS

    const columns: Column<IssueRead>[] = [
        { label: '🧑', content: issue => (
            <ProductUserPicture userId={issue.userId} productId={productId} class='icon small round'/>
        ) },
        { label: '#', class: 'center nowrap', content: issue => (
            issue.number
        ) },
        { label: 'Label', class: 'left fill', content: issue => (
            issue.label
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
                                    contextUser.admin || members.filter(member => member.userId == contextUser.userId && member.role == 'manager').length == 1 ? (
                                        <NavLink to={`/products/${productId}/milestones/${milestoneId}/settings`} className='button fill gray right'>
                                            <strong>Edit</strong> milestone
                                        </NavLink>
                                    ) : (
                                        <a className='button fill gray right'>
                                            <strong>Edit</strong> milestone <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <NavLink to='/auth/email' className='button fill gray right'>
                                        <strong>Edit</strong> milestone <span className='badge'>requires login</span>
                                    </NavLink>
                                )}
                                <h1>
                                    {milestone.label}
                                </h1>
                                <p>
                                    <ProductUserPicture productId={productId} userId={milestone.userId} class='icon small round'/>
                                    <span> </span>
                                    <ProductUserName productId={productId} userId={milestone.userId}/>
                                    <span> created this milestone on </span>
                                    <span className='date'>{formatDateHourMinute(new Date(milestone.created))}</span>
                                </p>
                                <p style={{color: 'gray'}}>
                                    <span>This milestone starts on</span>    
                                    <span className='badge stroke'>
                                        {formatDateHourMinute(new Date(milestone.start))}
                                    </span>
                                    <span style={{marginLeft: '0.5em'}}>and ends on</span>  
                                    <span className='badge stroke'>
                                        {formatDateHourMinute(new Date(milestone.end))}
                                    </span>
                                </p>
                                {contextUser ? (
                                    contextUser.admin || members.filter(member => member.userId == contextUser.userId).length == 1 ? (
                                        <NavLink to={`/products/${productId}/issues/new/settings?milestone=${milestoneId}`} onClick={handleClickLink} className='button fill green block-when-responsive'>
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
                                <NavLink to={`/products/${productId}/milestones/${milestoneId}/issues?state=open`} replace={true} className={`button ${state == 'open' ? 'fill' : 'stroke'} blue`}>
                                    <strong>Open</strong> issues <span className='badge'>{ milestone.openIssueCount }</span>
                                </NavLink>
                                <NavLink to={`/products/${productId}/milestones/${milestoneId}/issues?state=closed`} replace={true} className={`button ${state == 'closed' ? 'fill' : 'stroke'} blue`}>
                                    <strong>Closed</strong> issues <span className='badge'>{ milestone.closedIssueCount }</span>
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
                            <BurndownChartWidget start={milestone.start} end={milestone.end} total={total} actual={actual}/>
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