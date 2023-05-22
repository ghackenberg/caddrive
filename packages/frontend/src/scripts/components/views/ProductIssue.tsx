import  * as React from 'react'
import { useState, FormEvent, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Issue, Tag } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { useProduct } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { useIssues, useMembers, useTags } from '../../hooks/list'
import { IssueManager } from '../../managers/issue'
import { CommentCount } from '../counts/Comments'
import { IssueCount } from '../counts/Issues'
import { PartCount } from '../counts/Parts'
import { TagIssueFilterWidget } from '../widgets/TagIssueFilter'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { AssignedTagsWidget } from '../widgets/AssignedTags'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { Column, Table } from '../widgets/Table'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'
import LeftIcon from '/src/images/list.png'
import RightIcon from '/src/images/part.png'

export const ProductIssueView = () => {
    const { push } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const tags = useTags(productId)
    let issues = useIssues(productId)
    
    // STATES
    
    // - Interactions
    const [state, setState] = useState('open')
    const [hovered, setHovered] = useState<Issue>()
    const [active, setActive] = useState<string>('left')
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [selectedTagIds, setSelectedTagsIds] = useState<string[]>()
    issues = useIssues(productId, undefined, undefined, selectedTagIds)

    // FUNCTIONS

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

    async function selectTag(tag: Tag) {
        const newSelectedTags = [...selectedTags]
        const index = newSelectedTags.indexOf(tag)
        if (index == -1) {
            newSelectedTags.push(tag)
        } else {
            newSelectedTags.splice(index, 1)
        }
        setSelectedTags(newSelectedTags)
        setSelectedTagsIds(newSelectedTags.length > 0 ? newSelectedTags.map(tag => tag.id) : undefined)
    }

    // CONSTANTS

    const columns: Column<Issue>[] = [
        { label: '👤', content: issue => (
            <ProductUserPictureWidget userId={issue.userId} productId={productId} class='icon medium round'/>
        ) },
        { label: 'Label', class: 'left fill', content: issue => (
            <>
            <div>
                {issue.name}
            </div>
            <div>
                <AssignedTagsWidget issueId={issue.id}></AssignedTagsWidget>
            </div>
        </>
        ) },
        { label: 'Assignees', class: 'nowrap', content: issue => (
            issue.assigneeIds.map((assignedId) => (
                <ProductUserPictureWidget key={assignedId} userId={assignedId} productId={productId} class='icon medium round'/>
            ))
        ) },
        { label: 'Comments', class: 'center', content: issue => (
            <CommentCount issueId={issue.id}/>
        ) },
        { label: 'Parts', class: 'center', content: issue => (
            <PartCount issueId={issue.id}/>
        ) },
        { label: '🛠️', class: 'center', content: issue => (
            <a onClick={event => deleteIssue(event, issue)}>
                <img src={DeleteIcon} className='icon medium pad'/>
            </a>
        ) }
    ]

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'List view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        (product && members && issues && tags) ? (
            product.deleted ? (
                <Redirect to='/' />
            ) : (
                <>
                    <main className={`view product-issue sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div>
                                <div className='button-bar'>
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
                                        Open issues (<IssueCount productId={productId} state={'open'} tags= {selectedTagIds} />)
                                    </a>
                                    <a onClick={showClosedIssues} className={`button ${state == 'closed' ? 'fill' : 'stroke'} blue`}>
                                        Closed issues (<IssueCount productId={productId} state={'closed'} tags= {selectedTagIds} />)
                                    </a>
                                    <TagIssueFilterWidget label= '' tags={tags} selectedTags={selectedTags} onClick={selectTag}></TagIssueFilterWidget>
                                </div>
                                <Table columns={columns} items={issues.filter(issue => issue.state == state)} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={issue => push(`/products/${productId}/issues/${issue.id}/comments`)} />
                            </div>
                            <LegalFooter />
                        </div>
                        <div>
                            <ProductView3D productId={productId} issueId={hovered && hovered.id} mouse={true}/>
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