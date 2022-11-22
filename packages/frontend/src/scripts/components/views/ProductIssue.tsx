import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Redirect } from 'react-router'
// Commons
import { Comment, Issue, Member, Product, User } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
import { ProductManager } from '../../managers/product'
import { IssueManager } from '../../managers/issue'
import { CommentManager } from '../../managers/comment'
import { MemberManager } from '../../managers/member'
// Functions
import { collectParts, Part } from '../../functions/markdown'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductFooter } from '../snippets/ProductFooter'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView3D } from '../widgets/ProductView3D'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
// Images
import * as DeleteIcon from '/src/images/delete.png'

export const ProductIssueView = (props: RouteComponentProps<{product: string}>) => {

    // PARAMS

    const productId = props.match.params.product

    // INITIAL STATES   
    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMembers = productId == 'new' ? undefined : MemberManager.findMembersFromCache(productId)
    const initialIssues = productId == 'new' ? undefined : IssueManager.findIssuesFromCache(productId)
    const initialComments: {[id: string]: Comment[]} = {}
    for (const issue of initialIssues || []) {
        initialComments[issue.id] = CommentManager.findCommentsFromCache(issue.id)
    } 
    const initialUsers: {[id: string]: User} = {}
    for (const issue of initialIssues || []) {
        const user = UserManager.getUserFromCache(issue.userId)
        if (user) {
            initialUsers[user.id] = user
        }
        for (const comment of initialComments[issue.id] || []) {
            const otherUser = UserManager.getUserFromCache(comment.userId)
            if (otherUser) {
                initialUsers[otherUser.id] = otherUser
            }
        }
    } 
   const initialOpenIssues = productId == 'new' ? undefined : IssueManager.getIssueCount(productId, undefined, 'open')
   const initialClosedIssues = productId == 'new' ? undefined : IssueManager.getIssueCount(productId, undefined, 'closed')


    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [issues, setIssues] = useState<Issue[]>(initialIssues)
    const [comments, setComments] = useState<{[id: string]: Comment[]}>({})
    const [users, setUsers] = useState<{[id: string]: User}>(initialUsers)
    // - Computations
    const [issueParts, setIssueParts] = useState<{[id: string]: Part[]}>({})
    const [commentParts, setCommentParts] = useState<{[id: string]: Part[]}>({})
    const [partsCount, setPartsCount] = useState<{[id: string]: number}>({})
    const [openIssueCount, setOpenIssueCount] = useState<number>(initialOpenIssues)
    const [closedIssueCount, setClosedIssueCount] = useState<number>(initialClosedIssues)
    // - Interactions
    const [state, setState] = useState('open')
    const [hovered, setHovered] = useState<Issue>()
    const [hightlighted, setHighlighted] = useState<Part[]>()
    const [sidebar, setSidebar] = useState<boolean>(false)


    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMembers) }, [props])
    useEffect(() => { IssueManager.findIssues(productId).then(setIssues)}, [props, state])
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
    useEffect(() => {
        if (issueParts && commentParts && issues && comments) {
            const partsCountNew = {... partsCount}
            for(const issue of issues) {
                if(issue.id in issueParts) {
                    partsCountNew[issue.id] = issueParts[issue.id].length
                    if (issue.id in comments) {
                        for ( const comment of comments[issue.id]) {
                            if(comment.id in commentParts ) {
                                partsCountNew[issue.id] += commentParts[comment.id].length
                            }
                        }
                    }
                }
            }
            setPartsCount(partsCountNew)
        }
    }, [issueParts, commentParts])
    useEffect(() => { issues && setOpenIssueCount(issues.filter(issue => issue.state == 'open').length) },[issues])
    useEffect(() => { issues && setClosedIssueCount(issues.filter(issue => issue.state == 'closed').length) },[issues])



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
        if (confirm('Do you really want to delete this issue?')) {
            await IssueManager.deleteIssue(issue.id)
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
        { label: 'Parts', class: 'center', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.id in partsCount ? partsCount[issue.id] : '?'}
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
                            <main className={`sidebar ${sidebar ? 'visible' : 'hidden'}` }>
                                <div>
                                    <Link to={`/products/${productId}/issues/new/settings`} className='button green fill'>
                                        New issue
                                    </Link>
                                    <a onClick={showOpenIssues} className={`button blue ${state == 'open' ? 'fill' : 'stroke'}`}>
                                        Open issues ({openIssueCount != undefined ? openIssueCount : '?'})
                                    </a>
                                    <a onClick={showClosedIssues} className={`button blue ${state == 'closed' ? 'fill' : 'stroke'}`}>
                                        Closed issues ({closedIssueCount != undefined ? closedIssueCount : '?'})
                                    </a>
                                    <Table columns={columns} items={issues.filter(issue => issue.state == state)} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}/>
                                </div>
                                <div>
                                    <ProductView3D product={product} highlighted={hightlighted} mouse={true} vr= {true}/>
                                </div>
                            </main>
                            <ProductFooter sidebar={sidebar} setSidebar={setSidebar} item1={{'text':'Issues','image':'issue'}} item2={{'text':'3D-Modell','image':'part'}}></ProductFooter>
                        </Fragment>
                    )}
                 </Fragment>     
            )}
        </main>
    )
}