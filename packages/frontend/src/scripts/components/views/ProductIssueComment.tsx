import * as React from 'react'
import { useState, useContext, MouseEvent } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Object3D } from 'three'

import { Version } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { Part } from '../../functions/markdown'
import { computePath } from '../../functions/path'
import { useIssue, useProduct } from '../../hooks/entity'
import { useComments, useMembers } from '../../hooks/list'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { CommentView } from '../widgets/CommentView'
import { ProductUserNameWidget } from '../widgets/ProductUserName'
import { ProductView3D } from '../widgets/ProductView3D'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/comment.png'
import RightIcon from '/src/images/part.png'

export const ProductIssueCommentView = () => {

    // REFERENCES

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId, issueId } = useParams<{ productId: string, issueId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const issue = useIssue(issueId)
    const comments = useComments(issueId)

    // STATES

    // - Values

    // - Interactions
    const [marked, setMarked] = useState<Part[]>()
    const [selected, setSelected] = useState<Part[]>()
    const [active, setActive] = useState<string>('left')
    const [selectedTimeStamp, setSelectedTimeStamp] = useState<number>()
    const [selectedVersion, setSelectedVersion] = useState<Version>()
    const [selectedObject, setSelectedObject] = useState<Object3D>()

    // EFFECTS

    // FUNCTIONS

    function handleMouseOver(event: MouseEvent<HTMLAnchorElement>, part: Part) {
        event.preventDefault()
        setSelected([part])
    }

    function handleMouseOut(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
        setSelected(undefined)
    }

    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
    }

    function overObject(version: Version, object: Object3D) {
        const path = computePath(object)
        setSelected([{ productId: version.productId, versionId: version.id, objectPath: path, objectName: object.name }])
    }

    function outObject() {
        setSelected([])
    }

    function selectObject(version: Version, object: Object3D) {
        setSelectedTimeStamp(Date.now())
        setSelectedVersion(version)
        setSelectedObject(object)
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Thread view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        ((issueId == 'new' || issue) && product) ? (
            (issue && issue.deleted) ? (
                <Redirect to='/' />
            ) : (
                <>
                    <main className={`view product-issue-comment sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='header'>
                                {contextUser ? (
                                    members && members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                        <NavLink to={`/products/${productId}/issues/${issueId}/settings`} className='button fill gray right'>
                                            <strong>Edit</strong> issue
                                        </NavLink>
                                    ) : (
                                        <a className='button fill gray right'>
                                            <strong>Edit</strong> issue <span className='badge'>requires role</span>
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill gray right'>
                                        <strong>Edit</strong> issue <span className='badge'>requires login</span>
                                    </a>
                                )}
                                <h1>
                                    {issue.name}
                                </h1>
                                <p>
                                    <span className={`state ${issue.state}`}>
                                        {issue.state}
                                    </span>
                                    &nbsp;
                                    <strong>
                                        <ProductUserNameWidget userId={issue.userId} productId={productId} />
                                    </strong>
                                    &nbsp;
                                    <>
                                        opened issue on {new Date(issue.created).toISOString().substring(0, 10)}
                                    </>
                                </p>
                            </div>
                            <div className='main'>
                                <div className="widget issue_thread">
                                    {comments && comments.map((comment, index) => (
                                        <CommentView key={comment.id} class={`${index == 0 ? 'first' : 'comment'}`} productId={productId} issueId={issueId} commentId={comment.id} selectedTimestamp={selectedTimeStamp} selectedVersion={selectedVersion} selectedObject={selectedObject} setMarked={setMarked} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick} />
                                    ))}
                                    <CommentView class={`${comments && comments.length == 0 ? 'first' : 'comment'} self`} productId={productId} issueId={issueId} commentId={'new'} selectedTimestamp={selectedTimeStamp} selectedVersion={selectedVersion} selectedObject={selectedObject} setMarked={setMarked} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick} />
                                </div>
                            </div>
                            <LegalFooter />
                        </div>
                        <div>
                            <ProductView3D productId={productId} issueId={issueId} mouse={true} marked={marked} selected={selected} over={overObject} out={outObject} click={selectObject} />
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