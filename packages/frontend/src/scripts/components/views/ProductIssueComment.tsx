import * as React from 'react'
import { useState, useEffect, useContext, useRef, FormEvent, MouseEvent } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Object3D } from 'three'

import { Version } from 'productboard-common'

import { CommentClient } from '../../clients/rest/comment'
import { UserContext } from '../../contexts/User'
import { collectParts, createProcessor, Part } from '../../functions/markdown'
import { computePath } from '../../functions/path'
import { useIssue, useProduct } from '../../hooks/entity'
import { useComments, useMembers } from '../../hooks/list'
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
    const issue = useIssue(productId, issueId)
    const comments = useComments(productId, issueId)

    // STATES

    // - Values
    const [text, setText] = useState<string>('')
    const [audio, setAudio] = useState<Blob>()

    // - Interactions
    const [recorder, setRecorder] = useState<AudioRecorder>()
    const [audioUrl, setAudioUrl] = useState<string>('')
    const [marked, setMarked] = useState<Part[]>()
    const [selected, setSelected] = useState<Part[]>()
    const [active, setActive] = useState<string>('left')
    const [mode, setMode] = useState<string>('edit')
    const [html, setHtml] = useState<unknown>()
    const [parts, setParts] = useState<Part[]>()

    // EFFECTS

    useEffect(() => {
        setMarked(collectParts(text || ''))
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
        setSelected([{ productId: version.productId, versionId: version.versionId, objectPath: path, objectName: object.name }])
    }
    
    function outObject() {
        setSelected([])
    }

    function selectObject(version: Version, object: Object3D) {
        const path = computePath(object)
        const markdown = `[${object.name || object.type}](/products/${productId}/versions/${version.versionId}/objects/${path})`
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
            await CommentClient.addComment(productId, issueId, { text, action: 'none' }, { audio })
            setText('')
            setHtml(undefined)
            setMode('edit')
        }
        if (audio) {
            setAudio(undefined)
        }
    }

    async function submitCommentAndClose(event: FormEvent) {
        // TODO handle unmount!
        event.preventDefault()
        if (text) {
            await CommentClient.addComment(productId, issueId, { text, action: 'close' }, { audio })
            setText('')
            setHtml(undefined)
            setMode('edit')
        }
        if (audio) {
            setAudio(undefined)
        }
    }

    async function submitCommentAndReopen(event: FormEvent) {
        // TODO handle unmount!
        event.preventDefault()
        if (text) {
            await CommentClient.addComment(productId, issueId, { text, action: 'reopen' }, { audio })
            setText('')
            setHtml(undefined)
            setMode('edit')
        }
        if (audio) {
            setAudio(undefined)
        }
    }

    function handleEdit() {
        setMode('edit')
    }

    function handlePreview() {
        setHtml(createProcessor(handleMouseOver, handleMouseOut, handleClick).processSync(text).result)
        setParts(collectParts(text))
        setMode('preview')
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Thread view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    const edit = <a onClick={handleEdit}>edit</a>
    const preview = <a onClick={handlePreview}>preview</a>
    const action = mode == 'edit' ? <>(edit | {preview})</> : <>({edit} | preview)</>

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
                                    members.filter(member => member.userId == contextUser.userId).length == 1 ? (
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
                            </div>
                            <div className='main'>
                                <div className="widget issue_thread">
                                    <CommentView class="issue" productId={productId} issueId={issueId} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}/>
                                    {comments && comments.map(comment => (
                                        <CommentView key={comment.commentId} class="comment" productId={productId} issueId={issueId} commentId={comment.commentId} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}/>
                                    ))}
                                    <div className="comment self">
                                        <div className="head">
                                            <div className="icon">
                                                {contextUser ? (
                                                    <NavLink to={`/users/${contextUser.userId}`}>
                                                        <ProductUserPictureWidget userId={contextUser.userId} productId={productId} />
                                                    </NavLink>
                                                ) : (
                                                    <a>
                                                        <img src={UserIcon} className='icon small round' />
                                                    </a>
                                                )}
                                            </div>
                                            <div className="text">
                                                <p>
                                                    <strong>New comment</strong> {action}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="body">
                                            <div className="free" />
                                            <div className="text">
                                                {mode == 'edit' && <textarea ref={textReference} placeholder={'Type text'} value={text} onChange={event => setText(event.currentTarget.value)}/>}
                                                {mode == 'preview' && html}
                                                {contextUser ? (
                                                    members.filter(member => member.userId == contextUser.userId).length == 1 ? (
                                                        <>
                                                            {recorder ? (
                                                                <button onClick={stopRecordAudio} className='button fill gray block-when-responsive'>
                                                                    Stop recording
                                                                </button>
                                                            ) : (
                                                                audio ? (
                                                                    <>
                                                                        <audio src={audioUrl} controls />
                                                                        <button onClick={removeAudio} className='button fill gray block-when-responsive'>
                                                                            Remove recording
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button onClick={startRecordAudio} className='button fill gray block-when-responsive'>
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
                                                            <button className='button fill gray block-when-responsive'>
                                                                <span>Start recording</span>
                                                                <span className='badge'>requires role</span>
                                                            </button>                                                                
                                                            <button className='button fill blue'>
                                                                <span>Save</span>
                                                                <span className='badge'>requires role</span>
                                                            </button>
                                                            {issue.state == 'open' ? (
                                                                <button className='button stroke blue'>
                                                                    <span>Close</span>
                                                                    <span className='badge'>requires role</span>
                                                                </button>
                                                            ) : (
                                                                <button className='button stroke blue'>
                                                                    <span>Reopen</span>
                                                                    <span className='badge'>requires role</span>
                                                                </button>
                                                            )}
                                                        </>
                                                    )
                                                ) : (
                                                    <>
                                                        <button className='button fill gray block-when-responsive'>
                                                                <span>Start recording</span>
                                                                <span className='badge'>requires login</span>
                                                            </button>
                                                        <button className='button fill blue'>
                                                            <span>Save</span>
                                                            <span className='badge'>requires login</span>
                                                        </button>
                                                        {issue.state == 'open' ? (
                                                            <button className='button stroke blue'>
                                                                <span>Close</span>
                                                                <span className='badge'>requires login</span>
                                                            </button>
                                                        ) : (
                                                            <button className='button stroke blue'>
                                                                <span>Reopen</span>
                                                                <span className='badge'>requires login</span>
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {mode == 'preview' && parts && parts.map((part, index) => (
                                            <div key={index} className="note part">
                                                <div className="free"/>
                                                <div className="text">
                                                    <a href={`/products/${part.productId}/versions/${part.versionId}/objects/${part.objectPath}`} onMouseOver={event => handleMouseOver(event, part)} onMouseOut={event => handleMouseOut(event)} onClick={event => handleClick(event)}>
                                                        <span>
                                                            <img src={RightIcon}/>
                                                        </span>
                                                        {part.objectName}
                                                    </a>
                                                    was mentioned
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <LegalFooter/>
                        </div>
                        <div>
                            <ProductView3D productId={productId} issueId={issueId} mouse={true} marked={marked} selected={selected} over={overObject} out={outObject} click={selectObject}/>
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