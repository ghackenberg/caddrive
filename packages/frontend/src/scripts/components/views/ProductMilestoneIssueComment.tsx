import * as React from 'react'
import { useState, useContext, useRef } from 'react'
import { Redirect, useLocation, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Object3D } from 'three'

import { CommentRead, VersionRead } from 'productboard-common'

import { CommentContext } from '../../contexts/Comment'
import { VersionContext } from '../../contexts/Version'
import { UserContext } from '../../contexts/User'
import { useIssue, useProduct } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { useComments, useMembers, useVersions } from '../../hooks/list'
import { Part, collectParts } from '../../functions/markdown'
import { formatDateHourMinute } from '../../functions/time'
import { computePath } from '../../functions/path'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { CommentView } from '../widgets/CommentView'
import { MilestoneName } from '../values/MilestoneName'
import { ProductUserName } from '../values/ProductUserName'
import { ProductUserPicture } from '../values/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/comment.png'
import RightIcon from '/src/images/part.png'

type SubHandler = (version: VersionRead, object: Object3D) => void

type Index = {[commentId: string]: Part[]}

export const ProductMilestoneIssueCommentView = () => {

    // HISTORY

    const { push } = useAsyncHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)
    const { contextVersion, setContextVersion } = useContext(VersionContext)

    // LOCATION

    const { hash } = useLocation()

    // PARAMS

    const { productId, milestoneId, issueId } = useParams<{ productId: string, milestoneId: string, issueId: string }>()

    // ENTITIES

    const product = useProduct(productId)
    const members = useMembers(productId)
    const versions = useVersions(productId)
    const issue = useIssue(productId, issueId)
    const comments = useComments(productId, issueId)

    // REFS

    const ref = useRef<HTMLDivElement>()

    // INITIAL STATES

    const initialPartsView: Index = {}
    const initialPartsEdit: Index = {}
    
    for (const comment of comments || []) {
        initialPartsView[comment.commentId] = collectParts(comment.text)
        initialPartsEdit[comment.commentId] = []
    }

    const initialHighlighted: Part[] = []
    const initialSelected: Part[] = []
    const initialMarked: Part[] = []
    
    for (const commentId in initialPartsView || {}) {
        for (const part of initialPartsView[commentId] || []) {
            initialHighlighted.push(part)
        }
    }

    // STATES

    const [partsView, setPartsView] = useState(initialPartsView)
    const [partsEdit, setPartsEdit] = useState(initialPartsEdit)
    
    const [highlighted, setHighlighted] = useState(initialHighlighted)
    const [selected, setSelected] = useState(initialSelected)
    const [marked, setMarked] = useState(initialMarked)

    const [contextComment, setContextComment] = useState<CommentRead>()

    // EFFECTS

    React.useEffect(() => {
        const highlighted: Part[] = []
        const marked: Part[] = []
        for (const commentId in partsView || {}) {
            for (const part of partsView[commentId] || []) {
                highlighted.push(part)
            }
        }
        for (const commentId in partsEdit || {}) {
            for (const part of partsEdit[commentId] || []) {
                marked.push(part)
            }
        }
        setHighlighted(highlighted)
        setMarked(marked)
    }, [partsView, partsEdit])

    // FUNCTIONS

    function sub(commentId: string, handler: SubHandler) {
        handlers[commentId] = handler
        return () => {
            delete handlers[commentId]
        }
    }

    function up(commentId: string, myPartsView: Part[], myPartsEdit: Part[]) {
        setPartsView({...partsView, [commentId]: myPartsView})
        setPartsEdit({...partsEdit, [commentId]: myPartsEdit})
    }

    function overPart(_event: React.MouseEvent<HTMLAnchorElement>, part: Part) {
        setSelected([part])
    }

    async function clickPart(event: React.MouseEvent<HTMLAnchorElement>, part: Part) {
        event.preventDefault()
        // Change context version (if necessary)
        if (!contextVersion || contextVersion.versionId != part.versionId) {
            for (const version of versions) {
                if (version.versionId == part.versionId) {
                    setContextVersion(version)
                }
            }
        }
        // Switch to model view on small screens
        if (window.getComputedStyle(ref.current).display == 'none') {
            await push('#model')
        }
    }
    function outPart() {
        setSelected([])
    }

    function overObject3D(version: VersionRead, object: Object3D) {
        setSelected([{ productId, versionId: version.versionId, objectName: object.name, objectPath: computePath(object) }])
    }
    function outObject3D() {
        setSelected([])
    }
    function clickObject3D(version: VersionRead, object: Object3D) {
        if (contextComment) {
            if (contextComment.commentId in handlers) {
                handlers[contextComment.commentId](version, object)
            }
        } else {
            handlers[''](version, object)
        }
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { text: 'Thread view', image: LeftIcon, hash: '' },
        { text: 'Model view', image: RightIcon, hash: '#model' }
    ]

    const handlers: {[commentId: string]: SubHandler} = {}

    // RETURN

    return (
        ((issueId == 'new' || issue) && product) ? (
            (issue && issue.deleted) ? (
                <Redirect to='/' />
            ) : (
                <CommentContext.Provider value={{ contextComment, setContextComment }}>
                    <main className={`view product-issue-comment sidebar ${!hash ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='header'>
                                {contextUser ? (
                                    contextUser.admin || members.filter(member => member.userId == contextUser.userId).length == 1 ? (
                                        <NavLink to={`/products/${productId}/milestones/${milestoneId}/issues/${issueId}/settings`} className='button fill gray right'>
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
                                    <span className='number'>{issue.number}</span> {issue.label}
                                </h1>
                                <p>
                                    <ProductUserPicture productId={productId} userId={issue.userId} class='icon small round'/>
                                    <span> </span>
                                    <ProductUserName productId={productId} userId={issue.userId}/>
                                    <span> created this issue on <span className='date'>{formatDateHourMinute(new Date(issue.created))}</span></span>
                                </p>
                                <p>
                                    <span className={`state badge ${issue.state == 'open' ? 'red' : 'green'}`}>
                                        {issue.state}
                                    </span>
                                    {issue.milestoneId ? (
                                        <MilestoneName productId={productId} milestoneId={issue.milestoneId} class='milestone badge'/>
                                    ) : (
                                        <span className='milestone badge stroke'>not scheduled</span>
                                    )}
                                    {issue.assignedUserIds && issue.assignedUserIds.length > 0 ? (
                                        <span className='assignees'>
                                            {issue.assignedUserIds.map(assignedUserId => (
                                                <ProductUserPicture key={assignedUserId} productId={productId} userId={assignedUserId} class='icon small round'/>
                                            ))}
                                        </span>
                                    ) : (
                                        <span className='assignees badge stroke'>not assigned</span>
                                    )}
                                </p>
                            </div>
                            <div className='main'>
                                <div className="widget issue_thread">
                                    {comments && comments.map(comment => (
                                        <CommentView key={comment.commentId} productId={productId} issueId={issueId} commentId={comment.commentId} sub={sub} up={up} over={overPart} click={clickPart} out={outPart}/>
                                    ))}
                                    <CommentView productId={productId} issueId={issueId} sub={sub} up={up} over={overPart} click={clickPart} out={outPart}/>
                                </div>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div ref={ref}>
                            <ProductView3D productId={productId} mouse={true} highlighted={highlighted} selected={selected} marked={marked} over={overObject3D} out={outObject3D} click={clickObject3D}/>
                        </div>
                    </main>
                    <ProductFooter items={items}/>
                </CommentContext.Provider>
            )
        ) : (
            <LoadingView/>
        )
    )
}