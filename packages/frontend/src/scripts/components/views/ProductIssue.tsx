import  * as React from 'react'
import { useState, useEffect, useContext, Fragment, FormEvent } from 'react'
import { Redirect } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'

import { Comment, Issue, Member, Product, User } from 'productboard-common'

import { VersionContext } from '../../contexts/Version'
import { CommentManager } from '../../managers/comment'
import { IssueManager } from '../../managers/issue'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { countParts } from '../../functions/counter'
import { collectCommentParts, collectIssueParts, Part } from '../../functions/markdown'
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { Column, Table } from '../widgets/Table'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'

import * as DeleteIcon from '/src/images/delete.png'
import * as LoadIcon from '/src/images/load.png'
import * as LeftIcon from '/src/images/list.png'
import * as RightIcon from '/src/images/part.png'

export const ProductIssueView = (props: RouteComponentProps<{product: string}>) => {

    // CONTEXTS

    const contextVersion = useContext(VersionContext)

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
    const initialIssueParts = collectIssueParts(initialIssues)
    const initialCommentParts = collectCommentParts(initialComments)
    const initialPartsCount = countParts(initialIssues, initialComments, initialIssueParts, initialCommentParts)
    const initialOpenIssueCount = initialIssues ? initialIssues.filter(issue => issue.state == 'open').length : undefined
    const initialClosedIssueCount = initialIssues ? initialIssues.filter(issue => issue.state == 'closed').length : undefined

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct) 
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [issues, setIssues] = useState<Issue[]>(initialIssues)
    const [comments, setComments] = useState<{[id: string]: Comment[]}>(initialComments)
    const [users, setUsers] = useState<{[id: string]: User}>(initialUsers)
    // - Computations
    const [issueParts, setIssueParts] = useState<{[id: string]: Part[]}>(initialIssueParts)
    const [commentParts, setCommentParts] = useState<{[id: string]: Part[]}>(initialCommentParts)
    const [partsCount, setPartsCount] = useState<{[id: string]: number}>(initialPartsCount)
    const [openIssueCount, setOpenIssueCount] = useState<number>(initialOpenIssueCount)
    const [closedIssueCount, setClosedIssueCount] = useState<number>(initialClosedIssueCount)
    // - Interactions
    const [state, setState] = useState('open')
    const [hovered, setHovered] = useState<Issue>()
    const [hightlighted, setHighlighted] = useState<Part[]>()
    const [active, setActive] = useState<string>('left')

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
                for (let index = 0; index < issues.length; index++) {
                    newComments[issues[index].id] = issueComments[index]
                }
                setComments(newComments)
            })
        }
    }, [issues])

    // - Computations
    useEffect(() => { 
        setIssueParts(collectIssueParts(issues))
        updateHightlighted()
    }, [issues])
    useEffect(() => {
        setCommentParts(collectCommentParts(comments))   
        updateHightlighted()
    }, [comments])
    useEffect(() => {
        setPartsCount(countParts(issues, comments, issueParts, commentParts))
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                {issue.userId in users && members ? (
                    <ProductUserPictureWidget user={users[issue.userId]} members={members} class='big'/>
                ) : (
                    <img src={LoadIcon} className='big load'/>
                )}
            </Link>
        ) },
        { label: 'Label', class: 'left fill', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.label}
            </Link>
        ) },
        { label: 'Assignees', class: 'nowrap', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.assigneeIds.map((assignedId) => (
                    <Fragment key={assignedId}>
                        {assignedId in users && members ? (
                            <ProductUserPictureWidget user={users[assignedId]} members={members} class='big'/>
                        ) : (
                            <img src={LoadIcon} className='big load'/>
                        )}
                    </Fragment>
                ))}
            </Link>
        ) },
        { label: 'Comments', class: 'center', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.id in comments && comments[issue.id] ? comments[issue.id].length : '?'}
            </Link>
        ) },
        { label: 'Parts', class: 'center', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.id in partsCount ? partsCount[issue.id] : '?'}
            </Link>
        ) },
        { label: '', class: 'center', content: issue => (
            <a onClick={() => deleteIssue(issue)}>
                <img src={DeleteIcon} className='small'/>
            </a>
        ) }
    ]

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'List view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        <main className="view extended issues">
            {issues && product && (
                 <Fragment>
                    {product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className={`sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                                <div>
                                    <Link to={`/products/${productId}/issues/new/settings`} className='button green fill'>
                                        New issue
                                    </Link>
                                    <a onClick={showOpenIssues} className={`button blue ${state == 'open' ? 'fill' : 'stroke'}`}>
                                        Open issues ({openIssueCount !== undefined ? openIssueCount : '?'})
                                    </a>
                                    <a onClick={showClosedIssues} className={`button blue ${state == 'closed' ? 'fill' : 'stroke'}`}>
                                        Closed issues ({closedIssueCount !== undefined ? closedIssueCount : '?'})
                                    </a>
                                    <Table columns={columns} items={issues.filter(issue => issue.state == state)} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}/>
                                </div>
                                <div>
                                    <ProductView3D product={product} version={contextVersion.id != undefined ? contextVersion : null} highlighted={hightlighted} mouse={true} vr= {true} change = {contextVersion.update}/>
                                </div>
                            </main>
                            <ProductFooter items={items} active={active} setActive={setActive}/>
                        </Fragment>
                    )}
                 </Fragment>     
            )}
        </main>
    )
}