import * as React from 'react'
import { useState, useEffect, FormEvent, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Issue, Tag, TagAssignment } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { useAsyncHistory } from '../../hooks/history'
import { useIssuesComments, useIssues, useMembers, useProduct} from '../../hooks/route'
import { IssueManager } from '../../managers/issue'
import { TagManager } from '../../managers/tag'
import { TagAssignmentManager } from '../../managers/tagAssignment'
import { countParts } from '../../functions/counter'
import { collectCommentParts, collectIssueParts, Part } from '../../functions/markdown'
import { IssueCount } from '../counts/Issues'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { Column, Table } from '../widgets/Table'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/part.png'
import LoadIcon from '/src/images/load.png'

export const ProductIssueView = () => {
    const { push } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const issues = useIssues(productId)
    const comments = useIssuesComments(productId)

    // INITIAL STATES

    // - Computations

    const initialIssueParts = collectIssueParts(issues)
    const initialCommentParts = collectCommentParts(comments)
    const initialPartsCount = countParts(issues, comments, initialIssueParts, initialCommentParts)

    // STATES
    
    // - Computations
    const [assignedTags, setAssignedTags] = useState<{ [id: string]: Tag[] }>()
    const [tagAssignments, setTagAssignments] = useState<{ [id: string]: TagAssignment[] }>()
    const [issueParts, setIssueParts] = useState<{ [id: string]: Part[] }>(initialIssueParts)
    const [commentParts, setCommentParts] = useState<{ [id: string]: Part[] }>(initialCommentParts)
    const [partsCount, setPartsCount] = useState<{ [id: string]: number }>(initialPartsCount)

    // - Interactions
    const [state, setState] = useState('open')
    const [hovered, setHovered] = useState<Issue>()
    const [hightlighted, setHighlighted] = useState<Part[]>()
    const [active, setActive] = useState<string>('left')

    // EFFECTS

    // - Entities

    useEffect(() => {
        if (issues) {
            Promise.all(issues.map(issue => TagAssignmentManager.findTagAssignments(issue.id))).then(assignments => {
                const newAssignment = { ...tagAssignments }
                for (let index = 0; index < issues.length; index++) {
                    newAssignment[issues[index].id] = assignments[index]
                }
                setTagAssignments(newAssignment)
            })
        }
    }, [issues])

    useEffect(() => {
        if (tagAssignments) {

            const tagIds: string[] = []
            for (const issue of issues) {
                for (const tagAssignment of tagAssignments[issue.id]) {
                    if (!tagIds.includes(tagAssignment.tagId)) {
                        tagIds.push(tagAssignment.tagId)
                    }
                }
            }
            Promise.all(tagIds.map(tagId => TagManager.getTag(tagId))).then(tags => {
                const newTags: { [issueId: string]: Tag[] } = {}
                for (const issue of issues) {
                    newTags[issue.id] = []
                    for (const tagAssignment of tagAssignments[issue.id]) {
                        for (const tag of tags) {
                            if (tag.id == tagAssignment.tagId) {
                                newTags[issue.id].push(tag)
                                break
                            }
                        }
                    }
                }
                setAssignedTags(newTags)
            })
        }
    }, [tagAssignments])

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
                for (const comment of comments[hovered.id] || []) {
                    if (comment.id in commentParts) {
                        for (const part of commentParts[comment.id] || []) {
                            hightlighted.push(part)
                        }
                    }
                }
            }
            setHighlighted(hightlighted)
        } else {
            setHighlighted([])
        }
    }

    let timeout: NodeJS.Timeout

    function handleMouseOver(issue: Issue) {
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

    async function deleteIssue(event: React.UIEvent, issue: Issue) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this issue?')) {
            await IssueManager.deleteIssue(issue.id)
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
        {
            label: '👤', content: issue => (
                <ProductUserPictureWidget userId={issue.userId} productId={productId} class='icon medium round' />
            )
        },
        {
            label: 'Label', class: 'left fill', content: issue => (
                <>
                    <div>
                        {issue.name}
                    </div>
                    <div className='tag_container'>
                        {assignedTags ? assignedTags[issue.id].map((tag) => (
                            <div key={tag.id} className={`tag ${tag.color}`}>{tag.name}</div>
                        )) :
                            <img src={LoadIcon} className='icon medium pad animation spin' />
                        }
                    </div>
                </>
            )
        },
        {
            label: 'Assignees', class: 'nowrap', content: issue => (
                issue.assigneeIds.map((assignedId) => (
                    <ProductUserPictureWidget key={assignedId} userId={assignedId} productId={productId} class='icon medium round' />
                ))
            )
        },
        {
            label: 'Comments', class: 'center', content: issue => (
                issue.id in comments && comments[issue.id] ? comments[issue.id].length : '?'
            )
        },
        {
            label: 'Parts', class: 'center', content: issue => (
                issue.id in partsCount ? partsCount[issue.id] : '?'
            )
        },
        {
            label: '🛠️', class: 'center', content: issue => (
                <a onClick={event => deleteIssue(event, issue)}>
                    <img src={DeleteIcon} className='icon medium pad' />
                </a>
            )
        }
    ]

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'List view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        (product && members && issues) ? (
            product.deleted ? (
                <Redirect to='/' />
            ) : (
                <>
                    <main className={`view product-issue sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                        <NavLink to={`/products/${productId}/issues/new/settings`} className='button fill green button block-when-responsive'>
                                            New issue
                                        </NavLink>
                                    ) : (
                                        <a className='button fill green block-when-responsive' style={{ fontStyle: 'italic' }}>
                                            New issue (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill green' style={{ fontStyle: 'italic' }}>
                                    New issue (requires login)
                                </a>
                                )}
                                <a onClick={showOpenIssues} className={`button ${state == 'open' ? 'fill' : 'stroke'} blue`}>
                                    Open issues (<IssueCount productId={productId} state={'open'} />)
                                </a>
                                <a onClick={showClosedIssues} className={`button ${state == 'closed' ? 'fill' : 'stroke'} blue`}>
                                    Closed issues (<IssueCount productId={productId} state={'closed'} />)
                                </a>
                                <Table columns={columns} items={issues.filter(issue => issue.state == state)} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={issue => push(`/products/${productId}/issues/${issue.id}/comments`)} />
                            </div>
                            <LegalFooter />
                        </div>
                        <div>
                            <ProductView3D product={product} highlighted={hightlighted} mouse={true} />
                        </div>
                    </main>
                    <ProductFooter items={items} active={active} setActive={setActive} />
                </>
            )
        ) : (
            <LoadingView />
        )
    )
}