import  * as React from 'react'
import { useState, useEffect, useContext, useRef, FormEvent, MouseEvent, Fragment, ReactElement } from 'react'
import { Redirect } from 'react-router' 
import { Link, RouteComponentProps } from 'react-router-dom'
import { Object3D } from 'three'
// Commons
import { Comment, Issue, Member, Product, User, Version } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
import { ProductManager } from '../../managers/product'
import { IssueManager } from '../../managers/issue'
import { CommentManager } from '../../managers/comment'
// Functions
import { collectParts, createProcessor, Part } from '../../functions/markdown'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { CommentView } from '../widgets/CommentView'
import { ProductView3D } from '../widgets/ProductView3D'
import { MemberManager } from '../../managers/member'
import { ProductUserNameWidget } from '../widgets/ProductUserName'

export const ProductIssueCommentView = (props: RouteComponentProps<{product: string, issue: string}>) => {

    // CONSTANTS

    // REFERENCES

    const textReference = useRef<HTMLTextAreaElement>()

    // CONTEXTS

    const contextUser = useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>()
    const [members, setMember] = useState<Member[]>()
    const [issue, setIssue] = useState<Issue>()
    const [comments, setComments] = useState<Comment[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})
    // - Values
    const [text, setText] = useState<string>('')
    // - Computations
    const [issueHtml, setIssueHtml] = useState<ReactElement>()
    const [issueParts, setIssueParts] = useState<Part[]>([])
    const [commentsHtml, setCommentsHtml] = useState<{[id: string]: ReactElement}>({})
    const [commentsParts, setCommentsParts] = useState<{[id: string]: Part[]}>({})
    const [highlighted, setHighlighted] = useState<Part[]>()
    // - Interactions
    const [marked, setMarked] = useState<Part[]>()
    const [selected, setSelected] = useState<Part[]>()

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
            const dict = {...users}
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
            setIssueHtml(createProcessor(parts, handleMouseOver, handleMouseOut, handleClick).processSync(issue.text).result)
            setIssueParts(parts)
        }
    }, [issue])
    useEffect(() => {
        if (comments) {
            const commentsHtml: {[id: string]: ReactElement} = {}
            const commentsParts: {[id: string]: Part[]} = {}
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

    function handleMouseOver(event: MouseEvent<HTMLAnchorElement>, part: Part) {
        event.preventDefault()
        setSelected([part])
    }
    
    function handleMouseOut(event: MouseEvent<HTMLAnchorElement>, _part: Part) {
        event.preventDefault()
        setSelected(undefined)
    }

    function handleClick(event: MouseEvent<HTMLAnchorElement>, _part: Part) {
        event.preventDefault()
    }

    async function selectObject(version: Version, object: Object3D) {
        const markdown = `[${object.name}](/products/${product.id}/versions/${version.id}/objects/${object.name})`
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
            const comment = await CommentManager.addComment({ userId: contextUser.id, issueId: issue.id, time: new Date().toISOString(), text: text, action: 'none' }, {})
            setComments([...comments, comment])
            setText('')
        }
    }

    async function submitCommentAndClose(event: FormEvent) {
        event.preventDefault()
        if (text) {
            const comment = await CommentManager.addComment({ userId: contextUser.id, issueId: issue.id, time: new Date().toISOString(), text: text, action: 'close' }, {})
            setComments([...comments, comment])
            setText('')
            setIssue(await IssueManager.updateIssue(issueId, { label: issue.label, text: issue.text, state: 'closed', assigneeIds: issue.assigneeIds }))
        }
    }

    async function submitCommentAndReopen(event: FormEvent) {
        event.preventDefault()
        if (text) {
            const comment = await CommentManager.addComment({ userId: contextUser.id, issueId: issue.id, time: new Date().toISOString(), text: text, action: 'reopen' }, {})
            setComments([...comments, comment])
            setText('')
            setIssue(await IssueManager.updateIssue(issueId, { label: issue.label, text: issue.text, state: 'open', assigneeIds: issue.assigneeIds }))
        }
    }

    // RETURN

    return (
        <main className='view extended comments'>
            { (issueId == 'new' || issue) && product && (
                <Fragment>
                    { issue && issue.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <Link to={`/products/${productId}/issues/${issueId}/settings`} className='button gray fill right'>
                                        Edit issue
                                    </Link>
                                    <h1>
                                        {issue.label}
                                    </h1>
                                    <p>
                                        <span className={`state ${issue.state}`}>{issue.state}</span> <strong>{issue.userId in users && members ? <ProductUserNameWidget user={users[issue.userId]} members={members}/> : '?'}</strong> opened issue on {issue.time.substring(0, 10)}
                                    </p>
                                    
                                    <div className="widget thread">
                                        <CommentView class="issue" comment={issue} user={users[issue.userId]} html={issueHtml} parts={issueParts} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick} users= {users} members= {members}/>
                                        {comments && comments.map(comment => (
                                            <CommentView key={comment.id} class="comment" comment={comment} user={users[comment.userId]} html={commentsHtml[comment.id]} parts={commentsParts[comment.id]} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}  users= {users} members= {members}/>
                                        ))}
                                        <div className="comment self">
                                            <div className="head">
                                                <div className="icon">
                                                    <a href={`/users/${contextUser.id}`}>
                                                        <img src={`/rest/files/${contextUser.id}.jpg`}/>
                                                    </a>
                                                </div>
                                                <div className="text">
                                                    <p>
                                                        <strong>New comment</strong>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="body">
                                                <div className="free">

                                                </div>
                                                <div className="text">
                                                    <textarea ref={textReference} placeholder={'Type text'} value={text} onChange={event => setText(event.currentTarget.value)}/>
                                                    <button onClick={submitComment}>Save</button>
                                                    {issue.state == 'open' ? (
                                                        <button onClick={submitCommentAndClose}>Close</button>
                                                        ) : (
                                                        <button onClick={submitCommentAndReopen}>Reopen</button>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true} highlighted={highlighted} marked={marked} selected={selected} click={selectObject} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    ) }
                </Fragment>
            )}
        </main>
    )
}