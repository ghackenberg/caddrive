import  * as React from 'react'
import { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Comment, Issue, Product, User } from 'fhooe-audit-platform-common'
// Clients
import { CommentAPI, IssueAPI, ProductAPI, UserAPI } from '../../../clients/rest'
// Links
import { IssueLink } from '../../links/IssueLink'
// Widgets
import { Column, Table } from '../../widgets/Table'
import { ProductView } from '../../widgets/ProductView'
// Images
import * as AddIcon from '/src/images/add.png'
import * as EditIcon from '/src/images/edit.png'
import * as EventIcon from '/src/images/event.png'
import * as DeleteIcon from '/src/images/delete.png'

export const CommentListView = (props: RouteComponentProps<{issue: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const issueId = query.get('issue')

    // Define entities
    const [issue, setIssue] = useState<Issue>()
    const [product, setProduct] = useState<Product>()
    const [comments, setComments] = useState<Comment[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})

    // Load entities
    useEffect(() => { IssueAPI.getIssue(issueId).then(setIssue) }, [props])
    useEffect(() => { issue && ProductAPI.getProduct(issue.productId).then(setProduct) }, [issue])
    useEffect(() => { CommentAPI.findComments(issueId).then(setComments) }, [props])
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
    }, [props, comments])

    async function deleteComment(_id: string) {

    }

    const columns: Column<Comment>[] = [
        {label: '', content: _comment => <a><img src={EventIcon}/></a>},
        {label: 'User', content: comment => comment.userId in users ? <Link to={`/users/${comment.userId}`}>{users[comment.userId].name}</Link> : 'Loading'},
        {label: 'Date', content: comment => new Date(comment.time).toISOString().substring(0, 10)},
        {label: 'Time', content: comment => new Date(comment.time).toISOString().substring(11, 16)},
        {label: 'Text', content: comment => comment.text},
        {label: '', content: comment => <Link to={`/events/${comment.id}`}><img src={EditIcon}/></Link>},
        {label: '', content: comment => <a href="#" onClick={_event => deleteComment(comment.id)}><img src={DeleteIcon}/></a>},
        {label: '', content: _comment => '', class: 'fill'}
    ]

    return (
        <div className='view sidebar audit'>
            { issue && product && comments && (
                <React.Fragment>
                    <header>
                        <nav>
                            <IssueLink product={product} issue={issue}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>
                                Comments
                                <Link to={`/comments/new?issue=${issueId}`}>
                                    <img src={AddIcon}/>
                                </Link>
                            </h1>
                            <Table columns={columns} items={comments}/> 
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