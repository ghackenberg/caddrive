import  * as React from 'react'
import { useState, useEffect, useContext, createElement, FormEvent, MouseEvent, Fragment } from 'react'
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
import { ProductView } from '../widgets/ProductView'
// Inputs
import { TextInput } from '../inputs/TextInput'
import { TextareaInput } from '../inputs/TextareaInput'

export const IssueView = (props: RouteComponentProps<{product: string, issue: string}>) => {

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    const history = useHistory()

    const user = useContext(UserContext)

    function handleMouseOver(event: MouseEvent<HTMLAnchorElement>, productId: string, versionId: string, objectName: string) {
        event.preventDefault()
        console.log('mouseOver', productId, versionId, objectName)
    }
    function handleMouseOut(event: MouseEvent<HTMLAnchorElement>, productId: string, versionId: string, objectName: string) {
        event.preventDefault()
        console.log('mouseOut', productId, versionId, objectName)
    }
    function handleClick(event: MouseEvent<HTMLAnchorElement>, productId: string, versionId: string, objectName: string) {
        event.preventDefault()
        console.log('click', productId, versionId, objectName)
    }

    const regex = /\/products\/(.*)\/versions\/(.*)\/objects\/(.*)/

    const processor = unified().use(remarkParse).use(remarkRehype).use(rehypeReact, {
        createElement, components: {
            a: (props: any) => {
                const match = regex.exec(props.href || '')
                if (match) {
                    const productId = match[1]
                    const versionId = match[2]
                    const objectName = match[3]
                    return <a {...props} onMouseOver={event => handleMouseOver(event, productId, versionId, objectName)} onMouseOut={event => handleMouseOut(event, productId, versionId, objectName)} onClick={event => handleClick(event, productId, versionId, objectName)}/>
                } else {
                    return <a {...props}/>
                }
            }
        }
    })

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [issue, setIssue] = useState<Issue>()
    const [comments, setComments] = useState<Comment[]>()
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
        if (comments) {
            const load: string[] = []
            comments.forEach(event => {
                if (!(event.userId in users)) {
                    load.push(event.userId)
                }
            })
            load.forEach(userId => {
                UserAPI.getUser(userId).then(user => {
                    const dict = {...users}
                    dict[userId] = user
                    setUsers(dict)
                })
            })
        }
    }, [comments])

    // Load values
    useEffect(() => { issue && setIssueLabel(issue.label) }, [issue])
    useEffect(() => { issue && setIssueText(issue.text) }, [issue])

    async function selectObject(version: Version, object: Object3D) {
        if (issueId == 'new') {
            setIssueText(`${issueText}${issueText ? '\n\n' : ''}[${object.name}](/products/${product.id}/versions/${version.id}/objects/${object.name})`)
        } else {
            setCommentText(`${commentText}${commentText ? '\n\n' : ''}[${object.name}](/products/${product.id}/versions/${version.id}/objects/${object.name})`)
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
                                        <span className={`state ${issue.state}`}>{issue.state}</span> <strong>{issue.userId in users && users[issue.userId].name}</strong> opened on {issue.time.substring(0, 10)}
                                    </p>
                                    <div className="widget thread">
                                        <div className="issue">
                                            <div className="head">
                                                <div className="icon">
                                                    <a href={`/users/${issue.userId}`}></a>
                                                </div>
                                                <div className="text">
                                                    <p>
                                                        <strong>{issue.userId in users && users[issue.userId].name}</strong> commented on {issue.time.substring(0, 10)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="body">
                                                <div className="free">

                                                </div>
                                                <div className="text">
                                                    {processor.processSync(issue.text).result}
                                                </div>
                                            </div>
                                        </div>
                                        {comments && comments.map(comment => (
                                            <div key={comment.id} className="comment">
                                                <div className="head">
                                                    <div className="icon">
                                                        <a href={`/users/${comment.userId}`}></a>
                                                    </div>
                                                    <div className="text">
                                                        <p>
                                                            <strong>{comment.userId in users && users[comment.userId].name}</strong> commented on {comment.time.substring(0, 10)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <div className="free">

                                                    </div>
                                                    <div className="text">
                                                        {processor.processSync(comment.text).result}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="comment">
                                            <div className="head">
                                                <div className="icon">
                                                    <a href={`/users/${user.id}`}></a>
                                                </div>
                                                <div className="text">
                                                    <p>
                                                        <strong>You</strong> commented today
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