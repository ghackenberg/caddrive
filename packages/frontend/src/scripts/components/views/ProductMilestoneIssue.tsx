import  * as React from 'react'
import { useState, useEffect, FormEvent, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Issue } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { useAsyncHistory } from '../../hooks/history'
import { useMembers, useMilestone, useProduct, useMilestoneIssues, useMilestoneIssueComments } from '../../hooks/route'
import { calculateActual } from '../../functions/burndown'
import { countParts } from '../../functions/counter'
import { collectCommentParts, collectIssueParts, Part } from '../../functions/markdown'
import { IssueManager } from '../../managers/issue'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { BurndownChartWidget } from '../widgets/BurndownChart'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { Column, Table } from '../widgets/Table'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/chart.png'

export const ProductMilestoneIssueView = () => {
    
    const { goBack, replace, push } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId, milestoneId } = useParams<{ productId: string, milestoneId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const { members } = useMembers(productId)
    const milestone = useMilestone(milestoneId)
    const issues = useMilestoneIssues(productId, milestoneId)
    const { comments } = useMilestoneIssueComments(productId, milestoneId)

    // INITIAL STATES

    const initialIssueParts = collectIssueParts(issues)
    const initialCommentParts = collectCommentParts(comments)
    const initialPartsCount = countParts(issues, comments, initialIssueParts, initialCommentParts)
    
    // STATES

    // - Computations
    const [issueParts, setIssueParts] = useState<{[id: string]: Part[]}>(initialIssueParts)
    const [commentParts, setCommentParts] = useState<{[id: string]: Part[]}>(initialCommentParts)
    const [partsCount, setPartsCount] = useState<{[id: string]: number}>(initialPartsCount)
    const [total, setTotalIssueCount] = useState<number>() 
    const [actual, setActualBurndown] = useState<{ time: number, actual: number}[]>([])
    const [openIssueCount, setOpenIssueCount] = useState<number>()
    const [closedIssueCount, setClosedIssueCount] = useState<number>()

    // - Interactions
    const [state, setState] = useState('open')
    const [active, setActive] = useState<string>('left')

    // EFFECTS

    useEffect(() => {
        setIssueParts(collectIssueParts(issues))
    }, [issues])

    useEffect(() => {
        setCommentParts(collectCommentParts(comments)) 
    }, [comments])

    useEffect(() => {
        setPartsCount(countParts(issues, comments, issueParts, commentParts))
    }, [issueParts, commentParts])

    useEffect(() => { issues && setTotalIssueCount(issues.length) }, [issues])

    useEffect(() => {
        if (milestone && issues && comments) {
            setActualBurndown(calculateActual(milestone, issues, comments))
        }
    }, [milestone, issues, comments])

    useEffect(() => { issues && setOpenIssueCount(issues.filter(issue => issue.state == 'open').length) }, [issues])
    useEffect(() => { issues && setClosedIssueCount(issues.filter(issue => issue.state == 'closed').length) }, [issues])

    // FUNCTIONS

    async function deleteIssue(issue: Issue) {
        // TODO handle unmount!
        if (confirm('Do you really want to delete this issue from this milestone?')) {
            await IssueManager.updateIssue(issue.id, { ...issue, milestoneId: null })
        }
    }

    async function showClosedIssues(event: FormEvent) {
        event.preventDefault()
        setState('closed')
    }

    async function showOpenIssues(event: FormEvent) {
        event.preventDefault()
        setState('open')
    }

    async function handleClick(event: React.UIEvent<HTMLAnchorElement>) {
        event.preventDefault()
        const pathname = event.currentTarget.pathname
        const search = event.currentTarget.search
        await goBack()
        await replace(`/products/${productId}/issues`)
        await push(`${pathname}${search}`)
    }
    
    // CONSTANTS

    const columns: Column<Issue>[] = [
        { label: '👤', content: issue => (
            <NavLink to={`/products/${productId}/issues/${issue.id}/comments`} onClick={handleClick}>
                <ProductUserPictureWidget userId={issue.userId} productId={productId} class='icon medium round'/>
            </NavLink>
        ) },
        { label: 'Label', class: 'left fill', content: issue => (
            <NavLink to={`/products/${productId}/issues/${issue.id}/comments`} onClick={handleClick}>
                {issue.label}
            </NavLink>
        ) },
        { label: 'Assignees', class: 'nowrap', content: issue => (
            <NavLink to={`/products/${productId}/issues/${issue.id}/comments`} onClick={handleClick}>
                {issue.assigneeIds.map((assignedId) => (
                    <ProductUserPictureWidget key={assignedId} userId={assignedId} productId={productId} class='icon medium round'/>
                ))}
            </NavLink>
        ) },
        { label: 'Comments', class: 'center', content: issue => (
            <NavLink to={`/products/${productId}/issues/${issue.id}/comments`} onClick={handleClick}>
                {issue.id in comments ? comments[issue.id].length : '?'}
            </NavLink>
        ) },
        { label: 'Parts', class: 'center', content: issue => (
            <NavLink to={`/products/${productId}/issues/${issue.id}/comments`} onClick={handleClick}>
                {issue.id in partsCount ? partsCount[issue.id] : '?'}
            </NavLink>
        ) },
        { label: '🛠️', class: 'center', content: issue => (
            <a onClick={() => deleteIssue(issue)}>
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
                            <div>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id && member.role == 'manager').length == 1 ? (
                                        <NavLink to={`/products/${productId}/milestones/${milestoneId}/settings`} className='button fill gray right'>
                                            Edit milestone
                                        </NavLink>
                                    ) : (
                                        <a className='button fill gray right' style={{fontStyle: 'italic'}}>
                                            Edit milestone (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill gray right' style={{fontStyle: 'italic'}}>
                                        Edit milestone (requires login)
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
                                        <NavLink to={`/products/${productId}/issues/new/settings?milestone=${milestoneId}`} onClick={handleClick} className='button fill green block-when-responsive'>
                                            New issue
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green block-when-responsive' style={{fontStyle: 'italic'}}>
                                            New issue (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill green' style={{fontStyle: 'italic'}}>
                                        New issue (requires login)
                                    </a>
                                )}
                                <a onClick={showOpenIssues} className={`button ${state == 'open' ? 'fill' : 'stroke'} blue`}>
                                    Open issues ({openIssueCount != undefined ? openIssueCount : '?'})
                                </a>
                                <a onClick={showClosedIssues} className={`button ${state == 'closed' ? 'fill' : 'stroke'} blue`}>
                                    Closed issues ({closedIssueCount != undefined ? closedIssueCount : '?'})
                                </a>
                                <Table columns={columns} items={issues.filter(issue => issue.state == state)}/>
                            </div>
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