import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Redirect } from 'react-router'
// Commons
import { Comment, Issue, Member, Milestone, Product, User } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
import { ProductManager } from '../../managers/product'
import { MilestoneManager } from '../../managers/milestone'
import { IssueManager } from '../../managers/issue'
import { CommentManager } from '../../managers/comment'
import { MemberManager } from '../../managers/member'
// Functions
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { BurndownChartWidget } from '../widgets/BurndownChart'
// Images
import * as DeleteIcon from '/src/images/delete.png'
import { calculateActual } from '../../functions/burndown'

export const ProductMilestoneIssueView = (props: RouteComponentProps<{product: string, milestone: string}>) => {

    // PARAMS

    const productId = props.match.params.product
    const milestoneId = props.match.params.milestone

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>()
    const [milestone, setMilestone] = useState<Milestone>()
    const [members, setMembers] = useState<Member[]>()
    const [issues, setIssues] = useState<Issue[]>()
    const [comments, setComments] = useState<{[id: string]: Comment[]}>({})
    const [users, setUsers] = useState<{[id: string]: User}>({})
    // - Computations
    const [total, setTotalIssueCount] = useState<number>() 
    const [actual, setActualBurndown] = useState<{ time: number, actual: number}[]>([])
    const [openIssueCount, setOpenIssueCount] = useState<Number>()
    const [closedIssueCount, setClosedIssueCount] = useState<Number>()
    // - Interactions
    const [state, setState] = useState('open')

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MilestoneManager.getMilestone(milestoneId).then(setMilestone) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMembers) }, [props])
    useEffect(() => { IssueManager.findIssues(productId, milestoneId, 'open').then(openIssues => setOpenIssueCount(openIssues.length))}, [props])
    useEffect(() => { IssueManager.findIssues(productId, milestoneId, 'closed').then(closedIssues => setClosedIssueCount(closedIssues.length))}, [props])
    useEffect(() => { IssueManager.findIssues(productId, milestoneId).then(setIssues)}, [props, milestoneId])
    useEffect(() => {
        if (issues) {
            const userIds: string[] = []

            for (const issue of issues) {
                if (!(issue.userId in users || userIds.includes(issue.userId))) {
                    userIds.push(issue.userId)
                }
                for (const assigneeId of issue.assigneeIds) {
                    if (!(assigneeId in users || userIds.includes(assigneeId))) {
                        userIds.push(assigneeId)
                    }
                }
            }

            Promise.all(userIds.map(userId => UserManager.getUser(userId))).then(userObjects => {
                const newUsers = {...users}
                for (const user of userObjects) {
                    newUsers[user.id] = user
                }
                setUsers(newUsers)
            })
        }
    }, [issues])
    useEffect(() => {
        if (issues) {
            Promise.all(issues.map(issue => CommentManager.findComments(issue.id))).then(issueComments => {
                const newComments = {...comments}
                for (var index = 0; index < issues.length; index++) {
                    newComments[issues[index].id] = issueComments[index]
                }
                setComments(newComments)
            })
        }
    }, [issues])

    // - Computations
    useEffect(() => { issues && setTotalIssueCount(issues.length) }, [issues])
    useEffect(() => {
        if (milestone && issues && comments) {
            setActualBurndown(calculateActual(milestone, issues, comments))
        }
    }, [milestone, issues, comments])

    // FUNCTIONS

    async function deleteIssue(issue: Issue) {
        if (confirm('Do you really want to delete this issue from this milestone?')) {
            await IssueManager.updateIssue(issue.id, { ...issue, milestoneId: null })
            setIssues(issues.filter(other => other.id != issue.id))  
            
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

    // CONSTANTS

    const columns: Column<Issue>[] = [
        { label: 'Reporter', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                { issue.userId in users && members ? <ProductUserPictureWidget user={users[issue.userId]} members={members} class='big'/> : '?' }
            </Link>
        )},
        { label: 'Label', class: 'left fill', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.label}
            </Link>
        )},
        { label: 'Assignees', class: 'nowrap', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.assigneeIds.map((assignedId) => (
                    <Fragment key={assignedId}>
                        { assignedId in users && members ? <ProductUserPictureWidget user={users[assignedId]} members={members} class='big'/> : '?' }
                    </Fragment>
                ))}
            </Link>
        )},
        { label: 'Comments', class: 'center', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.id in comments ? comments[issue.id].length : '?'}
            </Link>
        )},
        { label: '', class: 'center', content: issue => (
            <a onClick={() => deleteIssue(issue)}>
                <img src={DeleteIcon} className='small'/>
            </a>
        )}
    ]

    // RETURN

    return (
        <main className="view extended issues">
            { issues && product && milestone && (
                 <Fragment>
                    { product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <Link to={`/products/${productId}/milestones/${milestoneId}/settings`} className='button gray fill right'>
                                        Edit milestone
                                    </Link>
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
                            
                                    <Link to={`/products/${productId}/issues/new/settings?milestone=${milestoneId}`} className='button green fill'>
                                        New issue
                                    </Link>

                                    <a onClick={showOpenIssues} className={`button blue ${state == 'open' ? 'fill' : 'stroke'}`}>
                                        Open issues ({openIssueCount != undefined ? openIssueCount : '?'})
                                    </a>
                                    <a onClick={showClosedIssues} className={`button blue ${state == 'closed' ? 'fill' : 'stroke'}`}>
                                        Closed issues ({closedIssueCount != undefined ? closedIssueCount : '?'})
                                    </a>
                                    <Table columns={columns} items={issues.filter(issue => issue.state == state)} />
                                </div>
                                <div style={{padding: '1em', backgroundColor: 'rgb(215,215,215)'}}>
                                    <BurndownChartWidget start={new Date(milestone.start)} end={new Date(milestone.end)} total={total} actual={actual}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>     
            )}
        </main>
    )
}