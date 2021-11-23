import  * as React from 'react'
import { useState, useEffect, useContext, FormEvent, Fragment } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Comment, Issue, Product, User } from 'fhooe-audit-platform-common'
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
        {label: 'User', content: comment => comment.userId in users ? <Link to={`/users/${comment.userId}`}>{users[comment.userId].name}</Link> : 'Loading'},
        {label: 'Date', content: comment => new Date(comment.time).toISOString().substring(0, 10)},
        {label: 'Time', content: comment => new Date(comment.time).toISOString().substring(11, 16)},
        {label: 'Text', content: comment => comment.text},
        {label: '', content: _comment => '', class: 'fill'}
    ]

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

    // Post events
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
                        </div>
                        <div>
                            <ProductView id={product.id} mouse={true}/>
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )
}