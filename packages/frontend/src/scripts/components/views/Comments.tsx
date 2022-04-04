import  * as React from 'react'
import { useState, useEffect, useContext, createElement, FormEvent, MouseEvent, Fragment, ReactElement } from 'react'
import { Redirect } from 'react-router' 
import { RouteComponentProps } from 'react-router-dom'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeReact from 'rehype-react'
import { Object3D } from 'three'
// Commons
import { Comment, Issue, Product, User, Version } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
import { ProductManager } from '../../managers/product'
import { IssueManager } from '../../managers/issue'
import { CommentManager } from '../../managers/comment'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { CommentView } from '../widgets/CommentView'
import { ProductView3D } from '../widgets/ProductView3D'

interface Part {
    productId: string
    versionId: string
    objectName: string
}

export const CommentsView = (props: RouteComponentProps<{product: string, issue: string}>) => {

    // CONSTANTS

    const regex = /\/products\/(.*)\/versions\/(.*)\/objects\/(.*)/

    // CONTEXTS

    const user = useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>()
    const [issue, setIssue] = useState<Issue>()
    const [comments, setComments] = useState<Comment[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})
    // - Values
    const [commentText, setCommentText] = useState<string>('')
    // - Computations
    const [issueHtml, setIssueHtml] = useState<ReactElement>()
    const [issueParts, setIssueParts] = useState<Part[]>([])
    const [commentsHtml, setCommentsHtml] = useState<{[id: string]: ReactElement}>({})
    const [commentsParts, setCommentsParts] = useState<{[id: string]: Part[]}>({})
    const [highlighted, setHighlighted] = useState<Part[]>()
    // - Interactions
    const [selected, setSelected] = useState<Part[]>()

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
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
            setIssueHtml(createProcessor(parts).processSync(issue.text).result)
            setIssueParts(parts)
        }
    }, [issue])
    useEffect(() => {
        if (comments) {
            const commentsHtml: {[id: string]: ReactElement} = {}
            const commentsParts: {[id: string]: Part[]} = {}
            for (const comment of comments) {
                const parts: Part[] = []
                commentsHtml[comment.id] = createProcessor(parts).processSync(comment.text).result
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

    // FUNCTIONS

    function createProcessor(parts: Part[]) {
        return unified().use(remarkParse).use(remarkRehype).use(rehypeReact, {
            createElement, components: {
                a: (props: any) => {
                    const match = regex.exec(props.href || '')
                    if (match) {
                        const productId = match[1]
                        const versionId = match[2]
                        const objectName = match[3]
                        const part = { productId, versionId, objectName }
                        parts.push(part)
                        return <a {...props} onMouseOver={event => handleMouseOver(event, part)} onMouseOut={event => handleMouseOut(event, part)} onClick={event => handleClick(event, part)}/>
                    } else {
                        return <a {...props}/>
                    }
                }
            }
        })
    }

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
        setCommentText(`${commentText}[${object.name}](/products/${product.id}/versions/${version.id}/objects/${object.name})`)
    }

    async function submitComment(event: FormEvent) {
        event.preventDefault()
        if (commentText) {
            const comment = await CommentManager.addComment({ userId: user.id, issueId: issue.id, time: new Date().toISOString(), text: commentText, action: 'none' })
            setComments([...comments, comment])
            setCommentText('')
        }
    }

    async function submitCommentAndClose(event: FormEvent) {
        event.preventDefault()
        if (commentText) {
            const comment = await CommentManager.addComment({ userId: user.id, issueId: issue.id, time: new Date().toISOString(), text: commentText, action: 'close' })
            setComments([...comments, comment])
            setCommentText('')
            setIssue(await IssueManager.updateIssue(issueId, { label: issue.label, text: issue.text, state: 'closed', assigneeIds: issue.assigneeIds }))
        }
    }

    async function submitCommentAndReopen(event: FormEvent) {
        event.preventDefault()
        if (commentText) {
            const comment = await CommentManager.addComment({ userId: user.id, issueId: issue.id, time: new Date().toISOString(), text: commentText, action: 'reopen' })
            setComments([...comments, comment])
            setCommentText('')
            setIssue(await IssueManager.updateIssue(issueId, { label: issue.label, text: issue.text, state: 'open', assigneeIds: issue.assigneeIds }))
        }
    }

    // RETURN

    return (
        <main className='view extended audit'>
            { (issueId == 'new' || issue) && product && (
                <Fragment>
                    { issue && issue.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <h1>
                                        {issue.label}
                                    </h1>
                                    <p>
                                        <span className={`state ${issue.state}`}>{issue.state}</span> <strong>{issue.userId in users && users[issue.userId].name}</strong> opened issue on {issue.time.substring(0, 10)}
                                    </p>
                                    <div className="widget thread">
                                        <CommentView class="issue" comment={issue} user={users[issue.userId]} html={issueHtml} parts={issueParts} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}/>
                                        {comments && comments.map(comment => (
                                            <CommentView key={comment.id} class="comment" comment={comment} user={users[comment.userId]} html={commentsHtml[comment.id]} parts={commentsParts[comment.id]} mouseover={handleMouseOver} mouseout={handleMouseOut} click={handleClick}/>
                                        ))}
                                        <div className="comment self">
                                            <div className="head">
                                                <div className="icon">
                                                    <a href={`/users/${user.id}`}>
                                                        <img src={`/rest/files/${user.id}.jpg`}/>
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
                                                    <textarea placeholder={'Type text'} value={commentText} onChange={event => setCommentText(event.currentTarget.value)}/>
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
                                    <ProductView3D product={product} mouse={true} highlighted={highlighted} selected={selected} click={selectObject} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    ) }
                </Fragment>
            )}
        </main>
    )
}