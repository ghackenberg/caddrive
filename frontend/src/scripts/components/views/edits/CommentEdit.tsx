import * as React from 'react'
import { useState, useEffect, useContext, FormEvent } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
// Commons
import { Product, Issue, Comment } from 'fhooe-audit-platform-common'
// Clients
import { CommentAPI, IssueAPI, ProductAPI } from '../../../clients/rest'
// Contexts
import { UserContext } from '../../../contexts/User'
// Links
import { CommentLink } from '../../links/CommentLink'
// Inputs
import { TextInput } from '../../inputs/TextInput'
// Widgets
import { ProductView } from '../../widgets/ProductView'

export const CommentEditView = (props: RouteComponentProps<{comment: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const issueId = query.get('issue')
    const commentId = props.match.params.comment

    const history = useHistory()

    const user = useContext(UserContext)

    // Define entities
    const [issue, setIssue] = useState<Issue>()
    const [comment, setComment] = useState<Comment>()
    const [product, setProduct] = useState<Product>()

    // Define values
    const [text, setText] = useState<string>('')

    // Load entities
    useEffect(() => { commentId == 'new' && IssueAPI.getIssue(issueId).then(setIssue) }, [props])
    useEffect(() => { commentId != 'new' && CommentAPI.getComment(commentId).then(setComment) }, [props])
    useEffect(() => { comment && IssueAPI.getIssue(comment.issueId).then(setIssue) }, [comment])
    useEffect(() => { issue && ProductAPI.getProduct(issue.productId).then(setProduct) }, [issue])

    // Load values
    useEffect(() => { comment && setText(comment.text) }, [comment])

    // Post events
    async function submit(event: FormEvent) {
        event.preventDefault()
        if (commentId == 'new') {
            if (text) {
                await CommentAPI.addComment({ userId: user.id, issueId: issue.id, time: new Date().toISOString(), text })
                history.replace(`/comments?issue=${issue.id}`)
            }
        }
        else {
            if (text) {
                await CommentAPI.updateComment(comment.id, { ...comment, text })
                history.replace(`/comments?issue=${issue.id}`)
            }
        }
    }

    async function reset(_event: FormEvent) {
        history.goBack()
    }

    return (
        <div className='view sidebar audit'>
            { (commentId == 'new' || comment) && issue && product && (
                <React.Fragment>
                    <header>
                        <nav>
                            <CommentLink product={product} issue={issue} comment={comment}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>
                                Comment editor
                            </h1>
                            <form onSubmit={submit} onReset={reset} className='data-input'>
                                <TextInput label='Text' placeholder={'Type text'} value={text} change={setText}/>
                                <div>
                                    <div/>
                                    <div>
                                        <input type='submit' value='Submit'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div>
                            <ProductView id={product.id} mouse={true}/>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )
    
}
