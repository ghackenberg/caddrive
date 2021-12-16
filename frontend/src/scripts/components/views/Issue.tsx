import  * as React from 'react'
import { useState, useEffect, useContext, createElement, FormEvent, MouseEvent, Fragment, ReactElement } from 'react'
import { useHistory } from 'react-router' 
import { RouteComponentProps } from 'react-router-dom'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeReact from 'rehype-react'
import { Object3D } from 'three'
// Commons
import { Comment, Issue, Product, User, Version } from 'productboard-common'
// Clients
import { CommentAPI, IssueAPI, ProductAPI, UserAPI } from '../../clients/rest'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { CommentView } from '../widgets/CommentView'
import { ProductView } from '../widgets/ProductView'
// Inputs
import { TextInput } from '../inputs/TextInput'
import { TextareaInput } from '../inputs/TextareaInput'
// Icons
import * as UserIcon from '/src/images/user.png'

interface Part {
    productId: string
    versionId: string
    objectName: string
}

export const IssueView = (props: RouteComponentProps<{product: string, issue: string}>) => {

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    const history = useHistory()

    const user = useContext(UserContext)

    function handleMouseOver(event: MouseEvent<HTMLAnchorElement>, part: Part) {
        event.preventDefault()
        console.log('mouseOver', part)
    }
    function handleMouseOut(event: MouseEvent<HTMLAnchorElement>, part: Part) {
        event.preventDefault()
        console.log('mouseOut', part)
    }
    function handleClick(event: MouseEvent<HTMLAnchorElement>, part: Part) {
        event.preventDefault()
        console.log('click', part)
    }

    const regex = /\/products\/(.*)\/versions\/(.*)\/objects\/(.*)/

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

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [issue, setIssue] = useState<Issue>()
    const [issueHtml, setIssueHtml] = useState<ReactElement>()
    const [issueParts, setIssueParts] = useState<Part[]>([])
    const [comments, setComments] = useState<Comment[]>()
    const [commentsHtml, setCommentsHtml] = useState<{[id: string]: ReactElement}>({})
    const [commentsParts, setCommentsParts] = useState<{[id: string]: Part[]}>({})
    const [users, setUsers] = useState<{[id: string]: User}>({})

    // Define values
    const [issueLabel, setIssueLabel] = useState<string>('')
    const [issueText, setIssueText] = useState<string>('')
    const [commentText, setCommentText] = useState<string>('')

    // Load entities
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { issueId != 'new' && IssueAPI.getIssue(issueId).then(setIssue) }, [props])
    useEffect(() => { issueId != 'new' && CommentAPI.findComments(issueId).then(setComments) }, [props])
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
        Promise.all(userIds.map(userId => UserAPI.getUser(userId))).then(userList => {
            const dict = {...users}
            for (const user of userList) {
                dict[user.id] = user
            }
            setUsers(dict)
        })
    }, [issue, comments])
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

    // Load values
    useEffect(() => { issue && setIssueLabel(issue.label) }, [issue])
    useEffect(() => { issue && setIssueText(issue.text) }, [issue])

    async function selectObject(version: Version, object: Object3D) {
        if (issueId == 'new') {
            setIssueText(`${issueText}[${object.name}](/products/${product.id}/versions/${version.id}/objects/${object.name})`)
        } else {
            setCommentText(`${commentText}[${object.name}](/products/${product.id}/versions/${version.id}/objects/${object.name})`)
        }
    }

    async function submitIssue(event: FormEvent){
        event.preventDefault()
        if (issueId == 'new') {
            if (issueLabel && issueText) {
                const issue = await IssueAPI.addIssue({ userId: user.id, productId, time: new Date().toISOString(), label: issueLabel, text: issueText, state: 'open' })
                history.replace(`/products/${productId}/issues/${issue.id}`)
            }
        } else {
            if (issueLabel && issueText) {
                setIssue(await IssueAPI.updateIssue(issue.id, { ...issue, label: issueLabel, text: issueText }))
            }
        }
    }

    async function submitComment(event: FormEvent) {
        event.preventDefault()
        if (commentText) {
            const comment = await CommentAPI.addComment({ userId: user.id, issueId: issue.id, time: new Date().toISOString(), text: commentText })
            setComments([...comments, comment])
            setCommentText('')
        }
    }

    return (
        <main className='view extended audit'>
            { (issueId == 'new' || issue) && product && (
                <Fragment>
                    <ProductHeader product={product}/>
                    <main className="sidebar">
                        <div>
                            {issue ? (
                                <Fragment>
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
                                                        <img src={UserIcon}/>
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <h1>Settings</h1>
                                    <form onSubmit={submitIssue} onReset={() => history.goBack()}>
                                        <TextInput class='fill' label='Label' placeholder='Type label' value={issueLabel} change={setIssueLabel}/>
                                        <TextareaInput class='fill' label='Text' placeholder='Type text' value={issueText} change={setIssueText}/>
                                        <div>
                                            <div/>
                                            <div>
                                                <input type='submit' value='Save'/>
                                            </div>
                                        </div>
                                    </form>
                                </Fragment>
                            )}
                        </div>
                        <div>
                            <ProductView product={product} mouse={true} click={selectObject}/>
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )
}