import  * as React from 'react'
import { useState, useEffect, useContext, FormEvent, Fragment } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Comment, Issue, Product, User, Version } from 'fhooe-audit-platform-common'
// Clients
import { CommentAPI, IssueAPI, ProductAPI, UserAPI } from '../../clients/rest'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView } from '../widgets/ProductView'
// Inputs
import { TextInput } from '../inputs/TextInput'
// Images
import * as DeleteIcon from '/src/images/delete.png'
import { Object3D } from 'three'

export const IssueView = (props: RouteComponentProps<{product: string, issue: string}>) => {

    const productId = props.match.params.product
    const issueId = props.match.params.issue

    const history = useHistory()

    const user = useContext(UserContext)

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

    const columns: Column<Comment>[] = [
        {label: 'User', class: 'top left nowrap', content: comment => comment.userId in users ? <Link to={`/users/${comment.userId}`}>{users[comment.userId].name}</Link> : 'Loading'},
        {label: 'Date', class: 'top center nowrap', content: comment => new Date(comment.time).toISOString().substring(0, 10)},
        {label: 'Time', class: 'top center nowrap', content: comment => new Date(comment.time).toISOString().substring(11, 16)},
        {label: 'Text', class: 'top left fill', content: comment => comment.text},
        {label: '', class: 'top', content: () => <img src={DeleteIcon}/>}
    ]

    async function selectObject(version: Version, object: Object3D) {
        if (issueId == 'new') {
            setIssueText(`${issueText}[${object.name || object.uuid}](/products/${productId}/versions/${version.id}/objects/${object.uuid})`)
        } else {
            setCommentText(`${commentText}[${object.name || object.uuid}](/products/${productId}/versions/${version.id}/objects/${object.uuid})`)
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
        <main className='view audit'>
            { (issueId == 'new' || issue) && product && (
                <Fragment>
                    <ProductHeader product={product}/>
                    <main className="sidebar">
                        <div>
                            {issue ? (
                                <Fragment>
                                    <h1>{issue.label}</h1>
                                    <p className={issue.state}>{issue.state}</p>
                                    <p>{issue.text}</p>
                                    <h2>Comments</h2>
                                    {comments && (
                                        <Fragment>
                                            <Table columns={columns} items={comments}/>
                                            <form onSubmit={submitComment} className='data-input'>
                                                <TextInput label='Text' placeholder={'Type text'} value={commentText} change={setCommentText}/>
                                                <div>
                                                    <div/>
                                                    <div>
                                                        <input type='submit' value='Submit'/>
                                                    </div>
                                                </div>
                                            </form>
                                        </Fragment>
                                    )}
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <h1>New issue</h1>
                                    <form onSubmit={submitIssue} onReset={() => history.goBack()} className='data-input'>
                                        <TextInput label='Label' placeholder='Type label' value={issueLabel} change={setIssueLabel}/>
                                        <TextInput label='Text' placeholder='Type text' value={issueText} change={setIssueText}/>
                                        <div>
                                            <div/>
                                            <div>
                                                { issueId == 'new' && <input type='reset' value='Cancel'/> }
                                                <input type='submit' value='Save'/>
                                            </div>
                                        </div>
                                    </form>
                                </Fragment>
                            )}
                        </div>
                        <div>
                            <ProductView id={product.id} mouse={true} click={selectObject}/>
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )
}