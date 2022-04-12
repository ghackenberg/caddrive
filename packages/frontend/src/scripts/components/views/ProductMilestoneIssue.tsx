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
import { collectParts, Part } from '../../functions/markdown'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView3D } from '../widgets/ProductView3D'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
// Images
import * as DeleteIcon from '/src/images/delete.png'

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
    const [issueParts, setIssueParts] = useState<{[id: string]: Part[]}>({})
    const [commentParts, setCommentParts] = useState<{[id: string]: Part[]}>({})
    // - Interactions
    const [state, setState] = useState('open')
    const [hovered, setHovered] = useState<Issue>()
    const [hightlighted, setHighlighted] = useState<Part[]>()

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MilestoneManager.getMilestone(milestoneId).then(setMilestone) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMembers) }, [props])
    useEffect(() => { IssueManager.findIssues(productId, milestoneId, state).then(setIssues)}, [props, milestoneId, state])
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
    useEffect(() => {
        if (issues) {
            const issuePartsNew: { [id: string]: Part[] } = {...issueParts}
            for (const issue of issues) {
                const parts: Part[] = []
                collectParts(issue.text, parts)
                issuePartsNew[issue.id] = parts
            }
            setIssueParts(issuePartsNew)
        }
        updateHightlighted()
    }, [issues])
    useEffect(() => {
        if (comments) {
            const commentPartsNew = {...commentParts}
            for (const issueId of Object.keys(comments)) {
                for (const comment of comments[issueId]) {
                    const parts: Part[] = []
                    collectParts(comment.text, parts)
                    commentPartsNew[comment.id] = parts
                }
            }
            setCommentParts(commentPartsNew)
        }
        updateHightlighted()
    }, [comments])

    // - Interactions
    useEffect(() => {
        updateHightlighted()
    }, [hovered])

    // FUNCTIONS

    function updateHightlighted() {
        if (hovered) {
            const hightlighted: Part[] = []
            if (hovered.id in issueParts) {
                issueParts[hovered.id].forEach(part => {
                    hightlighted.push(part)
                })
            }
            if (hovered.id in comments) {
                comments[hovered.id].forEach(comment => {
                    if (comment.id in commentParts) {
                        commentParts[comment.id].forEach(part => {
                            hightlighted.push(part)
                        })
                    }
                })
            }
            setHighlighted(hightlighted)
        } else {
            setHighlighted([])
        }
    }

    function handleMouseOver(issue: Issue) {
        setHovered(issue)
    }

    function handleMouseOut(_issue: Issue) {
        setHovered(undefined)
    }

    async function deleteIssue(issue: Issue) {
        if (confirm('Do you really want to delete this issue from this milestone?')) {
            await IssueManager.updateIssue(issue.id, { ...issue, milestoneId: 'none' })
            //setIssues(issues.filter(other => other.milestoneId != null))  
            
        }
    }
    console.table(issues)
    
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
            { issues && product && (
                 <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <Link to={`/products/${productId}/milestones/${milestoneId}/settings`}>
                                        Edit Milestone
                                    </Link>
                                    <h1>
                                        {milestone && milestone.label +' from ' + new Date(milestone.start).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit'} ) + ' to ' + new Date(milestone.end).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit'} ) }
                                    </h1>
                            
                                    <Link to={`/products/${productId}/issues/new/settings`}>
                                        New issue
                                    </Link>

                                    <a onClick={showOpenIssues} className={state == 'open' ? 'active' : ''}>
                                        Open issues
                                    </a>
                                    <a onClick={showClosedIssues} className={state == 'closed' ? 'active' : ''}>
                                        Closed issues
                                    </a>
                                    <Table columns={columns} items={issues} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}/>
                                </div>
                                <div>
                                    <ProductView3D product={product} highlighted={hightlighted} mouse={true} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>     
            )}
        </main>
    )
}