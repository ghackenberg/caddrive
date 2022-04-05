import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
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

    // PARAMS

    const productId = props.match.params.product

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>()
    const [issues, setIssues] = useState<Issue[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})
    const [comments, setComments] = useState<{[id: string]: number}>({})
    // - Interactions
    const [state, setState] = useState('open')

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { IssueManager.findIssues(productId,'',state).then(setIssues)}, [props, state])
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

    // FUNCTIONS

    async function deleteIssue(issue: Issue) {
        if (confirm('Do you really want to delete this issue?')) {
            await IssueManager.deleteIssue(issue.id)
            setIssues(issues.filter(other => other.id != issue.id))       
        }
    }
    
    async function showClosedIssues(event: FormEvent) {
        event.preventDefault()
        setState('closed')
   
    }
    async function showOpenIssues(event: FormEvent) {
        event.preventDefault()
        setState('open')
    }

    // CONSTANTS

    const columns: Column<Issue>[] = [
        { label: 'Reporter', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                <img src={`/rest/files/${issue.userId}.jpg`} className='big'/>
            </Link>
        )},
        { label: 'Label', class: 'left fill', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.label}
            </Link>
        )},
        { label: 'Assignees', class: 'nowrap', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.assigneeIds.map((assignedId) => (
                    <img key={assignedId} src={`/rest/files/${assignedId}.jpg`} className='big'/>
                ))}
            </Link>
        )},
        { label: 'Comments', class: 'center', content: issue => (
            <Link to={`/products/${productId}/issues/${issue.id}/comments`}>
                {issue.id in comments ? comments[issue.id] : '?'}
            </Link>
        )},
        { label: '', class: 'center', content: issue => (
            <a onClick={() => deleteIssue(issue)}>
                <img src={DeleteIcon} className='small'/>
            </a>
        )}
    ]

    // RETURN

    return (
        <main className="view extended issues">
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
                                    <a onClick={showOpenIssues} className={state == 'open' ? 'active' : ''}>
                                        Open issues
                                    </a>
                                    <a onClick={showClosedIssues} className={state == 'closed' ? 'active' : ''}>
                                        Closed issues
                                    </a>
                                    <Table columns={columns} items={issues}/>
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>     
            )}
        </main>
    )
}