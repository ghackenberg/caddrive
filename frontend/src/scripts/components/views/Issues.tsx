import  * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Issue, Product, User } from 'productboard-common'
// Clients
import { CommentAPI, IssueAPI, ProductAPI, UserAPI } from '../../clients/rest'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView } from '../widgets/ProductView'
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
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { IssueAPI.findIssues(productId).then(setIssues)}, [props])
    useEffect(() => {
        if (issues) {
            Promise.all(issues.map(issue => UserAPI.getUser(issue.userId))).then(issueUsers => {
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
            Promise.all(issues.map(issue => CommentAPI.findComments(issue.id))).then(issueComments => {
                const newComments = {...comments}
                for (var index = 0; index < issues.length; index++) {
                    newComments[issues[index].id] = issueComments[index].length
                }
                setComments(newComments)
            })
        }
    }, [issues])

    const columns: Column<Issue>[] = [
        {label: 'State', class: 'top center', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`} className={issue.state}>{issue.state}</Link>},
        {label: 'User', class: 'top left nowrap', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.id in users ? users[issue.id].name : '?'}</Link>},
        {label: 'Label', class: 'top left fill', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.label}</Link>},
        {label: 'Comments', class: 'center', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.id in comments ? comments[issue.id] : '?'}</Link>},
        {label: '', class: 'top', content: () => <img src={DeleteIcon}/>}
    ]

    return (
        <main className="view extended product">
            { issues && product && (
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
                            <ProductView product={product} mouse={true}/>
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )
}