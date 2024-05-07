import * as React from 'react'
import { useState, useContext } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Object3D } from 'three'

import { CommentRead, VersionRead } from 'productboard-common'

import { CommentContext } from '../../contexts/Comment'
import { UserContext } from '../../contexts/User'
import { useIssue, useProduct } from '../../hooks/entity'
import { useComments, useMembers } from '../../hooks/list'
import { Part, collectParts } from '../../functions/markdown'
import { formatDateTime } from '../../functions/time'
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

export const ProductIssueCommentView = () => {

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId, issueId } = useParams<{ productId: string, issueId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const issue = useIssue(productId, issueId)
    const comments = useComments(productId, issueId)

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
    const [active, setActive] = useState<string>('left')

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
        { name: 'left', text: 'Thread view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    const handlers: {[commentId: string]: SubHandler} = {}

    // RETURN

    return (
        ((issueId == 'new' || issue) && product) ? (
            (issue && issue.deleted) ? (
                <Redirect to='/' />
            ) : (
                <CommentContext.Provider value={{ contextComment, setContextComment }}>
                    <main className={`view product-issue-comment sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                        <div>
                            <div className='header'>
                                {contextUser ? (
                                    contextUser.admin || members.filter(member => member.userId == contextUser.userId).length == 1 ? (
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
                                    <span className='number'>{issue.number}</span> {issue.label}
                                </h1>
                                <p>
                                    <ProductUserPicture productId={productId} userId={issue.userId} class='icon small round'/>
                                    <span> </span>
                                    <ProductUserName productId={productId} userId={issue.userId}/>
                                    <span> created this issue on <span className='date'>{formatDateTime(new Date(issue.created))}</span></span>
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
                                        <CommentView key={comment.commentId} productId={productId} issueId={issueId} commentId={comment.commentId} sub={sub} up={up} over={overPart} out={outPart}/>
                                    ))}
                                    <CommentView productId={productId} issueId={issueId} sub={sub} up={up} over={overPart} out={outPart}/>
                                </div>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D productId={productId} mouse={true} highlighted={highlighted} selected={selected} marked={marked} over={overObject3D} out={outObject3D} click={clickObject3D}/>
                        </div>
                    </main>
                    <ProductFooter items={items} active={active} setActive={setActive} />
                </CommentContext.Provider>
            )
        ) : (
            <LoadingView/>
        )
    )
}