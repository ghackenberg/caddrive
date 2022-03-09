import  * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Redirect } from 'react-router'
// Commons
import { Issue, Product, User } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
import { ProductManager } from '../../managers/product'
import { IssueManager } from '../../managers/issue'
import { CommentManager } from '../../managers/comment'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView3D } from '../widgets/ProductView3D'
// Images
import * as DeleteIcon from '/src/images/delete.png'

export const IssuesView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [issues, setIssues] = useState<Issue[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})
    const [comments, setComments] = useState<{[id: string]: number}>({})

    // Load entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { IssueManager.findIssues(productId).then(setIssues)}, [props])
    useEffect(() => {
        if (issues) {
            Promise.all(issues.map(issue => UserManager.getUser(issue.userId))).then(issueUsers => {
                const newUsers = {...users}
                for (var index = 0; index < issues.length; index++) {
                    newUsers[issues[index].id] = issueUsers[index]
                }
                setUsers(newUsers)
            })
        }
    }, [issues])
    useEffect(() => {
        if (issues) {
            Promise.all(issues.map(issue => CommentManager.findComments(issue.id))).then(issueComments => {
                const newComments = {...comments}
                for (var index = 0; index < issues.length; index++) {
                    newComments[issues[index].id] = issueComments[index].length
                }
                setComments(newComments)
            })
        }
    }, [issues])

    async function deleteIssue(issue: Issue) {
        if (confirm('Do you really want to delete this issue?')) {
            await IssueManager.deleteIssue(issue.id)
            setIssues(issues.filter(other => other.id != issue.id))       
        }
    }

    const columns: Column<Issue>[] = [
        {label: 'State', class: 'center', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`} className={issue.state}>{issue.state}</Link>},
        {label: 'Picture', content: issue => <img src={`/rest/files/${issue.userId}.jpg`} className='big'/>},
        {label: 'User', class: 'left nowrap', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.id in users ? users[issue.id].name : '?'}</Link>},
        {label: 'Label', class: 'left fill', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.label}</Link>},
        {label: 'Comments', class: 'center', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.id in comments ? comments[issue.id] : '?'}</Link>},
        {label: '', class: 'center', content: issue => <a onClick={_event => deleteIssue(issue)}><img src={DeleteIcon} className='small'/> </a>}
    ]

    return (
        <main className="view extended product">
            { issues && product && (
                 <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                    <Link to={`/products/${productId}/issues/new`}>
                                        New issue
                                    </Link>
                                    <Table columns={columns} items={issues}/>
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>
                
            )}
        </main>
    )
}