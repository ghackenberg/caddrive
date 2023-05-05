import * as React from 'react'
import { useState, useEffect, useContext, useRef, FormEvent, MouseEvent, ReactElement } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Object3D } from 'three'

import { Version } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { collectParts, createProcessor, Part } from '../../functions/markdown'
import { computePath } from '../../functions/path'
import { useIssueComments, useIssue, useMembers, useProduct } from '../../hooks/route'
import { CommentManager } from '../../managers/comment'
import { IssueManager } from '../../managers/issue'
import { AudioRecorder } from '../../services/recorder'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { CommentView } from '../widgets/CommentView'
import { ProductUserNameWidget } from '../widgets/ProductUserName'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'
import { LoadingView } from './Loading'

import LeftIcon from '/src/images/comment.png'
import RightIcon from '/src/images/part.png'
import UserIcon from '/src/images/user.png'

export const ProductIssueCommentView = () => {

    // REFERENCES

    const textReference = useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const { productId, issueId } = useParams<{ productId: string, issueId: string }>()

    // HOOKS

    const product = useProduct(productId)
    const members = useMembers(productId)
    const issue = useIssue(issueId)
    const comments = useIssueComments(issueId)

    // INITIAL STATES

    const initialIssueParts: Part[] = []
    const initialIssueHtml = issue ? createProcessor(initialIssueParts, handleMouseOver, handleMouseOut, handleClick).processSync(issue.text).result : undefined

    const initialCommentsParts: { [id: string]: Part[] } = {}
    const initialCommentsHtml: { [id: string]: ReactElement } = {}
    for (const comment of comments || []) {
        const parts: Part[] = []
        initialCommentsHtml[comment.id] = createProcessor(parts, handleMouseOver, handleMouseOut, handleClick).processSync(comment.text).result
        initialCommentsParts[comment.id] = parts
    }

    const initialHighlighted: Part[] = []
    if (initialIssueParts) {
        for (const part of initialIssueParts) {
            initialHighlighted.push(part)
        }
    }
    if (comments && initialCommentsParts) {
        for (const comment of comments) {
            if (comment.id in initialCommentsParts) {
                for (const part of initialCommentsParts[comment.id]) {
                    initialHighlighted.push(part)
                }
            }
        }
    }

    // STATES

    // - Values
    const [text, setText] = useState<string>('')
    const [audio, setAudio] = useState<Blob>()

    // - Computations
    const [issueHtml, setIssueHtml] = useState<ReactElement>(initialIssueHtml)
    const [issueParts, setIssueParts] = useState<Part[]>(initialIssueParts)
    const [commentsHtml, setCommentsHtml] = useState<{ [id: string]: ReactElement }>(initialCommentsHtml)
    const [commentsParts, setCommentsParts] = useState<{ [id: string]: Part[] }>(initialCommentsParts)
    const [highlighted, setHighlighted] = useState<Part[]>(initialHighlighted)

    // - Interactions
    const [recorder, setRecorder] = useState<AudioRecorder>()
    const [audioUrl, setAudioUrl] = useState<string>('')
    const [marked, setMarked] = useState<Part[]>()
    const [selected, setSelected] = useState<Part[]>()
    const [active, setActive] = useState<string>('left')

    // EFFECTS

    useEffect(() => {
        if (issue) {
            const parts: Part[] = []
            setIssueHtml(createProcessor(parts, handleMouseOver, handleMouseOut, handleClick).processSync(issue.text).result)
            setIssueParts(parts)
        }
    }, [issue])

    useEffect(() => {
        if (comments) {
            const commentsHtml: { [id: string]: ReactElement } = {}
            const commentsParts: { [id: string]: Part[] } = {}
            for (const comment of comments) {
                const parts: Part[] = []
                commentsHtml[comment.id] = createProcessor(parts, handleMouseOver, handleMouseOut, handleClick).processSync(comment.text).result
                commentsParts[comment.id] = parts
            }
            setCommentsHtml(commentsHtml)
            setCommentsParts(commentsParts)
        }
    }, [comments])

    useEffect(() => {
        const highlighted: Part[] = []
        if (issueParts) {
            for (const part of issueParts) {
                highlighted.push(part)
            }
        }
        if (comments && commentsParts) {
            for (const comment of comments) {
                if (comment.id in commentsParts) {
                    for (const part of commentsParts[comment.id]) {
                        highlighted.push(part)
                    }
                }
            }
        }
        setHighlighted(highlighted)
    }, [issueParts, commentsParts])

    useEffect(() => {
        const parts: Part[] = []
        collectParts(text || '', parts)
        setMarked(parts)
    }, [text])

    // FUNCTIONS

    async function startRecordAudio(event: React.MouseEvent<HTMLButtonElement>) {
        // TODO handle unmount!
        event.preventDefault()
        const recorder = new AudioRecorder()
        await recorder.start()
        setRecorder(recorder)
    }

    async function stopRecordAudio(event: React.MouseEvent<HTMLButtonElement>) {
        // TODO handle unmount!
        event.preventDefault()
        const data = await recorder.stop()
        setAudio(data)
        setAudioUrl(URL.createObjectURL(data))
        setRecorder(null)
    }

    async function removeAudio(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setAudio(null)
        setAudioUrl('')
    }

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
        const path = computePath(object)
        const markdown = `[${object.name || object.type}](/products/${product.id}/versions/${version.id}/objects/${path})`
        if (document.activeElement == textReference.current) {
            const before = text.substring(0, textReference.current.selectionStart)
            const after = text.substring(textReference.current.selectionEnd)
            setText(`${before}${markdown}${after}`)
            setTimeout(() => {
                textReference.current.setSelectionRange(before.length + markdown.length, before.length + markdown.length)
            }, 0)
        } else {
            setText(`${text}${markdown}`)
            setTimeout(() => {
                textReference.current.focus()
            }, 0)
        }
    }

    async function submitComment(event: FormEvent) {
        // TODO handle unmount!
        event.preventDefault()
        if (text) {
            await CommentManager.addComment({ issueId: issue.id, text: text, action: 'none' }, { audio })
            setText('')
        }
        if (audio) {
            setAudio(undefined)
        }
    }

    async function submitCommentAndClose(event: FormEvent) {
        // TODO handle unmount!
        event.preventDefault()
        if (text) {
            await CommentManager.addComment({ issueId: issue.id, text: text, action: 'close' }, {})
            setText('')
        }
    }

    async function submitCommentAndReopen(event: FormEvent) {
        // TODO handle unmount!
        event.preventDefault()
        if (text) {
            await CommentManager.addComment({ issueId: issue.id, text: text, action: 'reopen' }, {})
            setText('')
            await IssueManager.updateIssue(issueId, { label: issue.label, text: issue.text, state: 'open', assigneeIds: issue.assigneeIds })
        }
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
                            <div>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                        <NavLink to={`/products/${productId}/issues/${issueId}/settings`} className='button fill gray right'>
                                            Edit issue
                                        </NavLink>
                                    ) : (
                                        <a className='button fill gray right' style={{ fontStyle: 'italic' }}>
                                            Edit issue (requires role)
                                        </a>
                                    )
                                ) : (
                                    <a className='button fill gray right' style={{ fontStyle: 'italic' }}>
                                        Edit issue (requires login)
                                    </a>
                                )}
                                <h1>
                                    {issue.label}
                                </h1>
                                <p>
                                    <span className={`state ${issue.state}`}>
                                        {issue.state}
                                    </span>
                                    &nbsp;
                                    <strong>
                                        <ProductUserNameWidget userId={issue.userId} productId={productId}/>
                                    </strong>
                                    &nbsp;
                                    <>
                                        opened issue on {new Date(issue.created).toISOString().substring(0, 10)}
                                    </>
                                </p>
                                <div className="widget issue_thread">
                                    <CommentView class="issue" comment={issue} productId={productId} html={issueHtml} parts={issueParts} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}/>
                                    {comments && comments.map(comment => (
                                        <CommentView key={comment.id} class="comment" comment={comment} productId={productId} html={commentsHtml[comment.id]} parts={commentsParts[comment.id]} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}/>
                                    ))}
                                    <div className="comment self">
                                        <div className="head">
                                            <div className="icon">
                                                {contextUser ? (
                                                    <NavLink to={`/users/${contextUser.id}`}>
                                                        <ProductUserPictureWidget userId={contextUser.id} productId={productId} />
                                                    </NavLink>
                                                ) : (
                                                    <a>
                                                        <img src={UserIcon} className='icon small round' />
                                                    </a>
                                                )}
                                            </div>
                                            <div className="text">
                                                <p>
                                                    <strong>New comment</strong>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="body">
                                            <div className="free" />
                                            <div className="text">
                                                <textarea ref={textReference} placeholder={'Type text'} value={text} onChange={event => setText(event.currentTarget.value)} />
                                                {contextUser ? (
                                                    members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                                        <>
                                                            {recorder ? (
                                                                <button onClick={stopRecordAudio} className='button fill gray block-when-responsive' >
                                                                    Stop recording
                                                                </button>
                                                            ) : (
                                                                audio ? (
                                                                    <>
                                                                        <audio src={audioUrl} controls />
                                                                        <button onClick={removeAudio} className='button fill gray block-when-responsive' >
                                                                            Remove recording
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button onClick={startRecordAudio} className='button fill gray block-when-responsive' >
                                                                        Start recording
                                                                    </button>
                                                                )
                                                            )}
                                                            <button className='button fill blue' onClick={submitComment}>
                                                                Save
                                                            </button>
                                                            {issue.state == 'open' ? (
                                                                <button className='button stroke blue' onClick={submitCommentAndClose}>
                                                                    Close
                                                                </button>
                                                            ) : (
                                                                <button className='button stroke blue' onClick={submitCommentAndReopen}>
                                                                    Reopen
                                                                </button>
                                                            )}
                                                        </>

                                                    ) : (
                                                        <>
                                                            <button className='button fill gray block-when-responsive' style={{ fontStyle: 'italic' }} >
                                                                Start recording (requires role)
                                                            </button>                                                                
                                                            <button className='button fill blue' style={{ fontStyle: 'italic' }}>
                                                                Save (requires role)
                                                            </button>
                                                            {issue.state == 'open' ? (
                                                                <button className='button stroke blue' style={{ fontStyle: 'italic' }}>
                                                                    Close (requires role)
                                                                </button>
                                                            ) : (
                                                                <button className='button stroke blue' style={{ fontStyle: 'italic' }}>
                                                                    Reopen (requires role)
                                                                </button>
                                                            )}
                                                        </>
                                                    )
                                                ) : (
                                                    <>
                                                        <button className='button fill gray block-when-responsive' style={{ fontStyle: 'italic' }} >
                                                                Start recording (requires login)
                                                            </button>
                                                        <button className='button fill blue' style={{ fontStyle: 'italic' }}>
                                                            Save (requires login)
                                                        </button>
                                                        {issue.state == 'open' ? (
                                                            <button className='button stroke blue' style={{ fontStyle: 'italic' }}>
                                                                Close (requires login)
                                                            </button>
                                                        ) : (
                                                            <button className='button stroke blue' style={{ fontStyle: 'italic' }}>
                                                                Reopen (requires login)
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D product={product} mouse={true} highlighted={highlighted} marked={marked} selected={selected} over={overObject} out={outObject} click={selectObject}/>
                        </div>
                    </main>
                    <ProductFooter items={items} active={active} setActive={setActive} />
                </>
            )
        ) : (
            <LoadingView/>
        )
    )
}