import * as React from 'react'
import { useState, useEffect, useContext, useRef, FormEvent, MouseEvent, Fragment, ReactElement } from 'react'
import { Redirect } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'

import { Object3D } from 'three'

import { Comment, Issue, Member, Product, User, Version } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { collectParts, createProcessor, Part } from '../../functions/markdown'
import { computePath } from '../../functions/path'
import { CommentManager } from '../../managers/comment'
import { IssueManager } from '../../managers/issue'
import { MemberManager } from '../../managers/member'
import { ProductManager } from '../../managers/product'
import { UserManager } from '../../managers/user'
import { AudioRecorder } from '../../services/recorder'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { CommentView } from '../widgets/CommentView'
import { ProductUserNameWidget } from '../widgets/ProductUserName'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { ProductView3D } from '../widgets/ProductView3D'

import * as LeftIcon from '/src/images/comment.png'
import * as RightIcon from '/src/images/part.png'
import * as UserIcon from '/src/images/user.png'

export const ProductIssueCommentView = (props: RouteComponentProps<{ product: string, issue: string }>) => {

    // CONSTANTS

    // REFERENCES

    const textReference = useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    // INITIAL STATES

    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialMembers = productId == 'new' ? undefined : MemberManager.findMembersFromCache(productId)
    const initialIssue = issueId == 'new' ? undefined : IssueManager.getIssueFromCache(issueId)
    const initialComments = issueId == 'new' ? undefined : CommentManager.findCommentsFromCache(issueId)

    const initialUsers: { [id: string]: User } = {}
    const user = UserManager.getUserFromCache(issueId)
    if (user) {
        initialUsers[user.id] = user
        for (const comment of initialComments || []) {
            const user = UserManager.getUserFromCache(comment.userId)
            if (user) {
                initialUsers[user.id] = user
            }
        }
    }

    const initialIssueParts: Part[] = []
    const initialIssueHtml = initialIssue ? createProcessor(initialIssueParts, handleMouseOver, handleMouseOut, handleClick).processSync(initialIssue.description).result : undefined

    const initialCommentsParts: { [id: string]: Part[] } = {}
    const initialCommentsHtml: { [id: string]: ReactElement } = {}
    for (const comment of initialComments || []) {
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
    if (initialComments && initialCommentsParts) {
        for (const comment of initialComments) {
            if (comment.id in initialCommentsParts) {
                for (const part of initialCommentsParts[comment.id]) {
                    initialHighlighted.push(part)
                }
            }
        }
    }

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    const [members, setMember] = useState<Member[]>(initialMembers)
    const [issue, setIssue] = useState<Issue>(initialIssue)
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [users, setUsers] = useState<{ [id: string]: User }>(initialUsers)
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

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { MemberManager.findMembers(productId).then(setMember) }, [props])
    useEffect(() => { IssueManager.getIssue(issueId).then(setIssue) }, [props])
    useEffect(() => { CommentManager.findComments(issueId).then(setComments) }, [props])
    useEffect(() => {
        const userIds: string[] = []
        if (issue) {
            if (!(issue.userId in users) && userIds.indexOf(issue.userId) == -1) {
                userIds.push(issue.userId)
            }
        }
        if (comments) {
            for (const comment of comments) {
                if (!(comment.userId in users) && userIds.indexOf(comment.userId) == -1) {
                    userIds.push(comment.userId)
                }
            }
        }
        Promise.all(userIds.map(userId => UserManager.getUser(userId))).then(userList => {
            const dict = { ...users }
            for (const user of userList) {
                dict[user.id] = user
            }
            setUsers(dict)
        })
    }, [issue, comments])

    // - Computations
    useEffect(() => {
        if (issue) {
            const parts: Part[] = []
            setIssueHtml(createProcessor(parts, handleMouseOver, handleMouseOut, handleClick).processSync(issue.description).result)
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
        event.preventDefault()
        const recorder = new AudioRecorder()
        await recorder.start()
        setRecorder(recorder)
    }

    async function stopRecordAudio(event: React.MouseEvent<HTMLButtonElement>) {
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
        event.preventDefault()
        if (text) {
            const comment = await CommentManager.addComment({ userId: contextUser.id, issueId: issue.id, time: new Date().toISOString(), text: text, action: 'none' }, { audio })
            setComments([...comments, comment])
            setText('')
        }
        if (audio) {
            setAudio(undefined)
        }
    }

    async function submitCommentAndClose(event: FormEvent) {
        event.preventDefault()
        if (text) {
            const comment = await CommentManager.addComment({ userId: contextUser.id, issueId: issue.id, time: new Date().toISOString(), text: text, action: 'close' }, {})
            setComments([...comments, comment])
            setText('')
            setIssue(await IssueManager.updateIssue(issueId, { name: issue.name, description: issue.description, state: 'closed', assigneeIds: issue.assigneeIds }))
        }
    }

    async function submitCommentAndReopen(event: FormEvent) {
        event.preventDefault()
        if (text) {
            const comment = await CommentManager.addComment({ userId: contextUser.id, issueId: issue.id, time: new Date().toISOString(), text: text, action: 'reopen' }, {})
            setComments([...comments, comment])
            setText('')
            setIssue(await IssueManager.updateIssue(issueId, { name: issue.name, description: issue.description, state: 'open', assigneeIds: issue.assigneeIds }))
        }
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Thread view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        <main className='view extended product-issue-comment'>
            {(issueId == 'new' || issue) && product && (
                <Fragment>
                    {issue && issue.deleted ? (
                        <Redirect to='/' />
                    ) : (
                        <Fragment>
                            <ProductHeader product={product} />
                            <main className={`sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                                <div>
                                    {contextUser ? (
                                        members.filter(member => member.userId == contextUser.id).length == 1 ? (
                                            <Link to={`/products/${productId}/issues/${issueId}/settings`} className='button fill gray right'>
                                                Edit issue
                                            </Link>
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
                                        {issue.name}
                                    </h1>
                                    <p>
                                        <span className={`state ${issue.state}`}>
                                            {issue.state}
                                        </span>
                                        &nbsp;
                                        <strong>
                                            {issue.userId in users && members ? (
                                                <ProductUserNameWidget user={users[issue.userId]} members={members} />
                                            ) : (
                                                '?'
                                            )}
                                        </strong>
                                        &nbsp;
                                        <>
                                            opened issue on {issue.time.substring(0, 10)}
                                        </>
                                    </p>
                                    <div className="widget issue_thread">
                                        <CommentView class="issue" comment={issue} user={users[issue.userId]} html={issueHtml} parts={issueParts} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick} users={users} members={members} />
                                        {comments && comments.map(comment => (
                                            <CommentView key={comment.id} class="comment" comment={comment} user={users[comment.userId]} html={commentsHtml[comment.id]} parts={commentsParts[comment.id]} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick} users={users} members={members} />
                                        ))}
                                        <div className="comment self">
                                            <div className="head">
                                                <div className="icon">
                                                    {contextUser ? (
                                                        <Link to={`/users/${contextUser.id}`}>
                                                            <ProductUserPictureWidget user={contextUser} members={members} />
                                                        </Link>
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
                                <div>
                                    <ProductView3D product={product} mouse={true} highlighted={highlighted} marked={marked} selected={selected} over={overObject} out={outObject} click={selectObject}/>
                                </div>
                            </main>
                            <ProductFooter items={items} active={active} setActive={setActive} />
                        </Fragment>
                    )}
                </Fragment>
            )}
        </main>
    )
}