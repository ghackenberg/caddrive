import * as React from 'react'
import { useState, useEffect, useContext, useRef, FormEvent, MouseEvent } from 'react'
import { Redirect, useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import { Object3D } from 'three'

import { Version } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { collectParts, Part } from '../../functions/markdown'
import { computePath } from '../../functions/path'
import { useIssue, useProduct } from '../../hooks/entity'
import { useComments, useMembers } from '../../hooks/list'
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
    const comments = useComments(issueId)

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
            await IssueManager.updateIssue(issueId, { ...issue })
            setText('')
        }
    }

    async function submitCommentAndReopen(event: FormEvent) {
        // TODO handle unmount!
        event.preventDefault()
        if (text) {
            await CommentManager.addComment({ issueId: issue.id, text: text, action: 'reopen' }, {})
            await IssueManager.updateIssue(issueId, { ...issue })
            setText('')
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
                            <div className='header'>
                                {contextUser ? (
                                    members.filter(member => member.userId == contextUser.id).length == 1 ? (
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
                                        <CommentView key={comment.id} class="comment" productId={productId} issueId={issueId} commentId={comment.id} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}/>
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
                                                                Start recording <span className='badge'>requires role</span>
                                                            </button>                                                                
                                                            <button className='button fill blue'>
                                                                Save <span className='badge'>requires role</span>
                                                            </button>
                                                            {issue.state == 'open' ? (
                                                                <button className='button stroke blue'>
                                                                    Close <span className='badge'>requires role</span>
                                                                </button>
                                                            ) : (
                                                                <button className='button stroke blue'>
                                                                    Reopen <span className='badge'>requires role</span>
                                                                </button>
                                                            )}
                                                        </>
                                                    )
                                                ) : (
                                                    <>
                                                        <button className='button fill gray block-when-responsive'>
                                                                Start recording <span className='badge'>requires login</span>
                                                            </button>
                                                        <button className='button fill blue'>
                                                            Save <span className='badge'>requires login</span>
                                                        </button>
                                                        {issue.state == 'open' ? (
                                                            <button className='button stroke blue'>
                                                                Close <span className='badge'>requires login</span>
                                                            </button>
                                                        ) : (
                                                            <button className='button stroke blue'>
                                                                Reopen <span className='badge'>requires login</span>
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